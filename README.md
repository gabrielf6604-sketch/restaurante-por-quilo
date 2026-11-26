# Plataforma de Controle de Consumo e Atendimento para Restaurante por Quilo

Plataforma integrada para apoiar a operação de restaurantes por quilo, com foco em rastreabilidade da saída do buffet, pedidos de bebidas, ocupação do salão e indicadores gerenciais.

> **Status:** base inicial versionada. O projeto será desenvolvido em etapas; integração com sensores, autenticação, caixa e operação real depende de configuração e validação em piloto.

## Cinco frentes do projeto

1. **Pesagem por cuba:** ESP32 + HX711 para registrar retiradas e reposições de ingredientes.
2. **Comanda por QR Code:** página web para solicitar bebidas e avisar quando o cliente terminou de montar o prato.
3. **Mapa de mesas:** estados disponível, ocupada, em limpeza e indisponível.
4. **Aplicativo da equipe:** ações de atendimento, limpeza, pedidos e reposição.
5. **Painel do gestor:** saída por ingrediente, reposições, pedidos, ocupação e tempo de limpeza.

## Stack definida na proposta

- Next.js, React, TypeScript, Tailwind CSS e shadcn/ui.
- PostgreSQL e Supabase (Database, Auth e Realtime).
- NestJS/Node.js quando regras de negócio exigirem API dedicada.
- ESP32, C/C++, Arduino framework e PlatformIO.
- Hospedagem prevista: Vercel para interface e Supabase/Railway/Render para serviços.

## Estrutura do repositório

```text
apps/
  web/                  # aplicação Next.js (especificação inicial)
  api/                  # API NestJS complementar (quando necessária)
database/
  001_schema.sql        # modelo PostgreSQL com 13 tabelas
  seed.example.sql      # dados demonstrativos fictícios
docs/
  arquitetura.md
  DER.md
  regras-de-negocio.md
  plano-de-implantacao.md
firmware/
  platformio.ini
  src/main.cpp
```

## Banco de dados

O modelo contempla as 13 entidades descritas na proposta: `ingrediente`, `cuba`, `leitura_peso`, `evento_cuba`, `funcionario`, `zona`, `mesa`, `atendimento_mesa`, `limpeza`, `comanda`, `item_cardapio`, `pedido_bebida` e `historico_pedido`.

Execute `database/001_schema.sql` em um PostgreSQL de desenvolvimento. Os dados de demonstração são opcionais e estão em `database/seed.example.sql`.

## Regras essenciais

- A balança mede **saída da cuba**, não consumo individual nem alimento efetivamente servido.
- Leituras instáveis não geram eventos.
- Reposição deve ser registrada separadamente de retirada.
- A mesa só volta a disponível após a conclusão da limpeza.
- Pedidos mantêm status e histórico de alterações.
- Indicadores de equipe devem ser analisados com contexto de turno e volume, sem ranking individual.

## Plano recomendado

Observação da operação → protótipo com dados fictícios → piloto de pesagem em duas ou três travessas → piloto de pedidos em poucas mesas → avaliação antes/depois → expansão do que funcionar.

Consulte `docs/plano-de-implantacao.md`.

## Pontos a validar com o restaurante

Sistema de caixa e integração; ingredientes prioritários; tipo das cubas; responsável pela reposição; planta e capacidade das mesas; preparo/cobrança das bebidas; Wi-Fi no buffet e salão; tolerância aceitável da balança.

## Execução

Veja as instruções em `apps/web/README.md` e `firmware/README.md`. Não publique chaves privadas ou credenciais no repositório.

## Autor

Projeto acadêmico — Análise e Desenvolvimento de Sistemas.
