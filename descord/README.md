# Descord

Sistema simples de formulario + PDF enviado ao Discord.

## Estrutura

- frontend/ - site estatico para GitHub Pages
- api/submit.js - funcao serverless para Vercel

## Passos

1. Substitua a URL do backend em frontend/app.js:
   - BACKEND_URL = "https://SEU-PROJETO.vercel.app/api/submit"
2. Faça deploy do backend na Vercel.
3. Defina a variavel de ambiente DISCORD_WEBHOOK_URL na Vercel.
4. Publique a pasta frontend/ no GitHub Pages.

## Observacoes

- O PDF e gerado no navegador com html2pdf.js.
- O backend envia o PDF e o texto para o Discord via webhook.
