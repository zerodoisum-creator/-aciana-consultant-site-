# ACIANA Consultant — novo site independente

Este projecto é uma nova base de código, separada do site antigo. Está preparado para alojar num serviço que suporte Node.js e para usar a API da OpenAI no servidor.

## O que inclui
- Página responsiva com letras legíveis em telemóvel.
- Serviços, perguntas frequentes, horário 08h–15h e slogan “O seu crescimento é a nossa prioridade.”
- WhatsApp oficial: +244 923 547 399.
- Chat de assistente virtual ligado ao endpoint `/api/chat`.
- Chave de API apenas no servidor, limites de pedidos e cabeçalhos de segurança básicos.

## Requisitos
- Node.js 20 ou superior.
- Conta da OpenAI API com faturação configurada.
- Alojamento com Node.js e HTTPS.
- Acesso ao domínio/DNS para publicar o novo site.

## Testar localmente
1. Instalar Node.js no computador ou usar o ambiente do responsável técnico.
2. Na pasta do projecto, executar `npm install`.
3. Copiar `.env.example` para `.env`.
4. Criar uma chave secreta na plataforma da OpenAI e colocá-la em `OPENAI_API_KEY` no `.env`. Nunca a pôr em `public/` nem no código do browser.
5. Executar `npm start`.
6. Abrir `http://localhost:3000`.

Sem a chave, o site abre, mas o chat real responde com aviso de configuração em falta.

## Publicar e controlar o domínio
1. Criar um serviço novo num alojamento que suporte Node.js (por exemplo, Render, Railway ou VPS gerida).
2. Carregar este projecto para um repositório privado ou enviar o ZIP ao técnico.
3. Configurar `OPENAI_API_KEY` e `OPENAI_MODEL` nas variáveis de ambiente do alojamento, não num ficheiro público.
4. Testar `/api/health` e o chat em ambiente de teste.
5. Só depois alterar o DNS do domínio para o novo alojamento.
6. Guardar os acessos do domínio, alojamento e repositório em contas controladas pela empresa, com autenticação de dois factores e pelo menos dois administradores de confiança.

**Importante:** ter o código novo não transfere automaticamente a propriedade do domínio. Para controlar `acianaconsult.com`, a empresa precisa de acesso autorizado à conta do registrador do domínio e às configurações DNS. Se outra pessoa detém esses acessos, será necessário pedir transferência ou autorização ao titular actual. Não altere o DNS sem confirmar a propriedade e manter um plano de reversão.

## O que falta antes de publicar
- Confirmar que o slogan oficial é exactamente “O seu crescimento é a nossa prioridade.”
- Validar todos os serviços, termos legais, endereço, contactos e horários com a empresa.
- Confirmar se o horário 08h–15h se aplica de segunda a sexta-feira.
- Adicionar política de privacidade e consentimento adequado se forem recolhidos dados pessoais.
- Testar acessibilidade, telemóveis, custo por conversa, limites, erros e encaminhamento para WhatsApp.
- A assistente usa uma descrição inicial dos serviços, não documentos internos ou tabela oficial de preços. A empresa deve fornecer conteúdo aprovado antes de divulgar respostas específicas.

## Sobre a “linguagem criada pela empresa”
A identidade visual, tom de voz, frases e regras da assistente podem ser exclusivos da ACIANA. Para a implementação web, este projecto usa HTML, CSS, JavaScript e Node.js, tecnologias comuns que facilitam manutenção e transferência para outro técnico. Não é aconselhável inventar uma nova linguagem de programação, porque dificultaria a manutenção futura.
