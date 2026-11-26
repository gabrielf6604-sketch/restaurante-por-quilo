# Aplicação Web

Frontend em Next.js + React + TypeScript, com Tailwind CSS. A tela inicial contém um painel demonstrativo responsivo com dados fictícios.

## Rodar localmente

```bash
cd apps/web
npm install
npm run dev
```

Acesse http://localhost:3000.

## Configurar Supabase

Crie um projeto Supabase e preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` no arquivo `.env.local`, usando como referência o `.env.example` da raiz.

A chave `SUPABASE_SERVICE_ROLE_KEY` nunca deve ser usada no navegador.

## Próximas entregas

- Conectar autenticação e autorização por perfil.
- Substituir dados fictícios por consultas ao PostgreSQL.
- Implementar a página pública de comanda por QR Code.
- Implementar mapa do salão e área operacional.
- Adicionar filtros de data/turno e exportação CSV/PDF.

A interface atual é um protótipo visual; não recebe pedidos reais nem se conecta a sensores.
