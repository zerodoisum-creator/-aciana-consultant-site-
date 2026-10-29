import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT || 3000);
const MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '12kb' }));
app.use('/api/', rateLimit({ windowMs: 60_000, limit: 20, standardHeaders: 'draft-7', legacyHeaders: false }));
app.use(express.static(path.join(root, 'public')));

const systemPrompt = `És a Assistente Virtual da ACIANA Consultant, empresa que presta serviços de apoio a negócios em Angola. Comunica em português claro, profissional, cordial e comercial. Ajuda a compreender o pedido, faz uma pergunta de cada vez e sugere o próximo passo de forma persuasiva, sem pressionar. Áreas publicamente indicadas no site: constituição de empresas; contabilidade e fiscalidade; recursos humanos; finanças e sistemas de gestão. Horário de atendimento humano: 08h às 15h, de segunda a sexta-feira. WhatsApp oficial: +244 923 547 399. Slogan oficial: “O seu crescimento é a nossa prioridade.” Não inventes preços, prazos, documentos obrigatórios, resultados garantidos, credenciais, leis ou condições comerciais. Se a resposta depender do caso ou de confirmação interna, diz isso com clareza e oferece encaminhamento para a equipa. Não peças senhas, dados bancários, números completos de documentos ou informação pessoal desnecessária. Não afirmes que és humano. Respostas concisas, úteis e orientadas para ajudar o visitante.`;

app.get('/api/health', (_req, res) => res.json({ ok: true, aiConfigured: Boolean(process.env.OPENAI_API_KEY) }));

app.post('/api/chat', async (req, res) => {
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  const prior = Array.isArray(req.body?.history) ? req.body.history : [];
  if (!message || message.length > 1200) return res.status(400).json({ error: 'Escreva uma pergunta com até 1200 caracteres.' });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: 'A assistente ainda não está configurada. Contacte a equipa pelo WhatsApp.' });

  const safeHistory = prior.slice(-8).filter(m =>
    m && ['user', 'assistant'].includes(m.role) && typeof m.content === 'string'
  ).map(m => ({ role: m.role, content: m.content.slice(0, 1200) }));

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        instructions: systemPrompt,
        input: [...safeHistory, { role: 'user', content: message }],
        max_output_tokens: 450
      }),
      signal: AbortSignal.timeout(25000)
    });
    const payload = await response.json();
    if (!response.ok) {
      console.error('OpenAI API error:', response.status, payload?.error?.type || 'unknown');
      return res.status(502).json({ error: 'A assistente está temporariamente indisponível. Tente novamente ou contacte a equipa.' });
    }
    const reply = (payload.output || []).flatMap(item => item.content || []).filter(c => c.type === 'output_text').map(c => c.text).join('\n').trim();
    if (!reply) return res.status(502).json({ error: 'Não foi possível preparar uma resposta. Tente novamente.' });
    const lower = message.toLowerCase();
    const whatsappSuggested = /(preço|preco|orçamento|orcamento|contratar|marcar|consultor|contact|contato|whatsapp|proposta|quero abrir|quero aderir)/.test(lower);
    return res.json({ reply, whatsappSuggested });
  } catch (error) {
    console.error('Chat request failed:', error.name || 'Error');
    return res.status(504).json({ error: 'A resposta demorou mais do que o esperado. Tente novamente.' });
  }
});

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(root, 'public', 'index.html'));
});
app.listen(PORT, () => console.log(`ACIANA site server listening on port ${PORT}`));
