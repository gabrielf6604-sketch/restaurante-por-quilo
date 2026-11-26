# Aplicação Web

Frontend planejado em Next.js + React + TypeScript, com Tailwind CSS e shadcn/ui.

## Módulos de interface

- Área pública da comanda acessada por QR Code.
- Mapa de mesas para salão.
- Área operacional da equipe.
- Painel do gestor com filtros por data/turno e exportação CSV/PDF.

## Inicialização

Na raiz do repositório:

```bash
npx create-next-app@latest apps/web --typescript --tailwind --eslint --app --src-dir
```

Depois configure as variáveis de ambiente a partir de `.env.example` e instale o cliente Supabase:

```bash
cd apps/web
npm install @supabase/supabase-js
```

Este diretório contém a especificação inicial; as telas e fluxos devem ser implementados por etapas e validados com dados fictícios antes do piloto.
