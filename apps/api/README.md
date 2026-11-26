# API complementar (NestJS)

A proposta prioriza Supabase para banco, autenticação e realtime no piloto. NestJS/Node.js/TypeScript é uma camada complementar, indicada quando regras de negócio ou integração com dispositivos exigirem serviço dedicado.

Responsabilidades candidatas:
- validar e receber eventos do ESP32;
- classificar/validar eventos de pesagem no servidor;
- aplicar autorização de perfis;
- coordenar transições de status e histórico de pedidos;
- expor relatórios agregados.

Não coloque a chave Service Role no frontend. Antes de ativar ingestão de dispositivos, implemente autenticação por dispositivo, validação de payload, idempotência e limites de requisição.
