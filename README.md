# Plataforma de Controle de Consumo e Atendimento para Restaurante por Quilo

> **Repositório público para avaliação acadêmica.** Mantenha este repositório como **PUBLIC** durante todo o período de avaliação.

## 1. Apresentação do projeto

Restaurantes por quilo normalmente conhecem o peso total do prato no caixa, mas não têm informação detalhada sobre quais ingredientes saem do buffet, quanto cada ingrediente representa em custo e em quais etapas do atendimento os clientes esperam mais. Também pode faltar uma visão integrada da ocupação das mesas, dos pedidos de bebidas e das rotinas da equipe.

A proposta é desenvolver uma plataforma web integrada para registrar a saída dos alimentos por cuba, organizar pedidos de bebidas por QR Code, acompanhar o estado das mesas, apoiar a equipe e oferecer indicadores ao gestor.

## 2. Problema identificado

- O peso total do prato não revela a quantidade de cada ingrediente retirada do buffet.
- Sem dados por ingrediente e horário, fica mais difícil estimar custos e planejar reposições.
- Pedidos de bebidas e avisos dos clientes podem depender de chamadas presenciais ao garçom.
- A ocupação das mesas e o tempo de limpeza podem não estar registrados de forma centralizada.
- A gestão precisa reunir informações de diferentes etapas para identificar gargalos.

## 3. Solução proposta

A solução é organizada em cinco frentes conectadas:

1. **Balança por cuba:** células de carga e HX711 conectados a ESP32 registram variações estáveis de peso de cada travessa. Retiradas e reposições são classificadas separadamente.
2. **Comanda de bebidas por QR Code:** cada mesa tem um QR Code que abre uma página web sem exigir aplicativo ou cadastro. O cliente solicita bebidas e pode avisar quando terminou de montar o prato.
3. **Mapa de mesas:** planta do salão com estados disponível, ocupada, em limpeza e indisponível, além da capacidade e localização das mesas.
4. **Aplicativo da equipe:** fluxos rápidos para iniciar/encerrar atendimento, iniciar/concluir limpeza, receber pedidos e registrar reposições.
5. **Painel do gestor:** indicadores por ingrediente, reposições, horários de pico, pedidos, ocupação e tempo de limpeza, com filtros por data/turno e previsão de exportação CSV/PDF.

### Como as frentes se integram

O ESP32 envia eventos de pesagem para a base de dados. A comanda QR registra os pedidos vinculados à mesa. A equipe atualiza atendimento, limpeza e andamento dos pedidos. O mapa reflete a situação operacional e o painel reúne os registros para apoiar decisões.

## 4. Tecnologias

- **Interface web:** Next.js, React, TypeScript, Tailwind CSS e shadcn/ui.
- **Banco de dados:** PostgreSQL, com Supabase como opção de serviço gerenciado.
- **Autenticação e tempo real:** Supabase Auth e Supabase Realtime ou WebSocket.
- **API complementar:** NestJS, Node.js e TypeScript quando regras de negócio exigirem serviço dedicado.
- **Hardware:** ESP32, HX711 e célula de carga.
- **Firmware:** C/C++, framework Arduino e PlatformIO.
- **Hospedagem prevista:** Vercel para interface; Supabase, Railway ou Render para serviços.

## 5. Desenvolvimento e estrutura da solução

- `apps/web/`: aplicação Next.js e painel demonstrativo.
- `apps/api/`: documentação da API complementar prevista.
- `database/`: script PostgreSQL e dados fictícios para demonstração.
- `firmware/`: projeto PlatformIO e código inicial para ESP32/HX711.
- `docs/`: arquitetura, DER, regras de negócio, indicadores e plano de implantação.
- `docs/evidencias/`: orientação para as capturas de tela.
- `docs/apresentacao.html`: apresentação navegável com até cinco slides.

### Banco de dados

O modelo relacional possui 13 tabelas: `ingrediente`, `cuba`, `leitura_peso`, `evento_cuba`, `funcionario`, `zona`, `mesa`, `atendimento_mesa`, `limpeza`, `comanda`, `item_cardapio`, `pedido_bebida` e `historico_pedido`.

- [Script de criação PostgreSQL](database/001_schema.sql)
- [Dados fictícios para teste](database/seed.example.sql)
- [Diagrama Entidade-Relacionamento](docs/DER.md)

## 6. Capturas de tela da solução

A entrega deve conter **no máximo cinco imagens**. As capturas finais devem mostrar telas reais da versão executável, sem dados pessoais ou informações sensíveis.

| Evidência | Arquivo sugerido | O que mostrar |
|---|---|---|
| 1 | `01-painel-gestor.png` | Painel e indicadores |
| 2 | `02-mapa-mesas.png` | Mesas e seus estados |
| 3 | `03-comanda-qr.png` | Página de pedido pelo QR Code |
| 4 | `04-aplicativo-equipe.png` | Fluxo de atendimento/limpeza |
| 5 | `05-pesagem-cuba.png` | Leitura da balança ou protótipo ESP32 |

**Status:** pendentes de captura da aplicação executando. Não foram usadas imagens ilustrativas como se fossem evidências reais. Consulte [docs/evidencias/README.md](docs/evidencias/README.md).

## 7. Vídeo de apresentação prática (até 2 minutos)

**Link do vídeo:** PENDENTE — inserir aqui o link público do vídeo final (YouTube não listado ou Google Drive com acesso liberado para avaliação).

O vídeo deverá mostrar a solução prática funcionando, explicar rapidamente o problema e percorrer as funcionalidades que estiverem implementadas. Não apresentar telas planejadas como se já estivessem funcionando.

## 8. Apresentação (até 5 slides)

- [Abrir apresentação navegável — 5 slides](docs/apresentacao.html)
- [Ver roteiro dos slides](docs/roteiro-apresentacao.md)

A apresentação cobre problema e solução, etapas de desenvolvimento, arquitetura e banco de dados, integração das cinco frentes e apresentação final.

## 9. Como executar o que já está disponível

### Painel web demonstrativo

```bash
cd apps/web
npm install
npm run dev
```

Abra http://localhost:3000. O painel inicial usa **dados fictícios** e demonstra a direção visual. Ainda não está conectado ao banco nem recebe pedidos reais.

### Banco de dados

Crie um banco PostgreSQL de desenvolvimento e execute `database/001_schema.sql`. Para inserir dados de demonstração, execute opcionalmente `database/seed.example.sql`.

### Firmware

Abra `firmware/` no VS Code com PlatformIO. Os pinos e o fator de calibração são valores de referência e precisam ser ajustados ao hardware real.

## 10. Regras e limitações importantes

- A balança mede a **saída da cuba**, não o consumo individual nem confirma que o alimento chegou ao prato. Descarte, queda e contato com a travessa podem alterar a leitura.
- Leituras instáveis não devem gerar eventos.
- As leituras de referência são 10 por segundo; a janela de estabilização prevista é de 1,5 a 3 segundos. O limiar inicial de 20 a 50 g e a tolerância aproximada de 5 g precisam ser ajustados no piloto.
- O aumento estável de peso é tratado como reposição.
- Em caso de perda de internet, o dispositivo deverá guardar eventos e sincronizar depois; essa persistência ainda precisa ser implementada e testada no firmware.
- A mesa só pode voltar a disponível após a limpeza concluída.
- Pedidos devem manter status e histórico.
- A cobrança no caixa e sua integração dependem do sistema utilizado pelo restaurante.
- O custo calculado a partir da saída da cuba é estimado; a margem real exige cruzamento com compras e estoque.
- Tempos de equipe devem ser avaliados por turno e volume, sem ranking individual.

## 11. Plano de implantação

A implantação proposta começa com observação da operação e protótipo com dados fictícios. Depois, recomenda-se um piloto de pesagem em duas ou três travessas de ingredientes de maior custo e um piloto de pedidos em poucas mesas. A expansão deve ocorrer somente após avaliar precisão, adesão, custos e retorno.

Detalhes: [Plano de implantação e validação](docs/plano-de-implantacao.md).

## 12. Estado atual da entrega

| Item | Situação |
|---|---|
| Repositório público e estrutura inicial | Disponível |
| Documentação do problema e proposta | Disponível neste README |
| Modelo PostgreSQL e DER | Arquivos publicados; validar no PostgreSQL |
| Painel web demonstrativo | Protótipo visual com dados fictícios |
| Firmware ESP32/HX711 | Estrutura inicial; requer calibração e testes |
| Comanda QR, mapa de mesas e app da equipe | Planejados; implementação pendente |
| Capturas reais (máximo 5) | Pendente |
| Vídeo prático (até 2 min) | Pendente |
| Apresentação (até 5 slides) | HTML a ser publicado no repositório |

## Autor

Projeto acadêmico — Análise e Desenvolvimento de Sistemas.
