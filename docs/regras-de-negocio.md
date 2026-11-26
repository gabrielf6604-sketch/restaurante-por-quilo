# Regras de negócio

## Buffet e pesagem

1. Cada cuba ativa deve estar associada a um ingrediente.
2. A calibração deve ser válida antes da operação.
3. Leituras instáveis não geram eventos de retirada/reposição.
4. Variações inferiores ao limiar são ignoradas e comparadas ao último peso registrado, permitindo acumular retiradas pequenas.
5. Aumento grande e estável representa reposição, não retirada.
6. Eventos podem ter origem no sensor ou lançamento manual.
7. O custo estimado é: `(quantidade_em_gramas / 1000) * custo_por_kg`.
8. A medição representa saída da cuba, não consumo individual ou alimento efetivamente servido.

## Mesas e atendimento

1. A mesa pode estar disponível, ocupada, em limpeza ou indisponível.
2. O início/fim do atendimento registra funcionário, mesa, quantidade de pessoas e horários.
3. Ao encerrar a ocupação, a mesa passa para limpeza.
4. A mesa só pode voltar para disponível depois que a limpeza for concluída.
5. O bloqueio/liberação administrativa é restrito a perfis autorizados.

## Comandas e bebidas

1. Cada mesa possui um QR Code que abre uma página web, sem exigir instalação de aplicativo ou cadastro do cliente.
2. O cliente seleciona uma bebida, confirma o pedido e pode avisar quando terminou de montar o prato.
3. O aviso de prato pronto é apenas um status operacional; não exige informar ingredientes.
4. Pedido de bebida possui status: recebido, em preparo, entregue ou cancelado.
5. Toda alteração de status deve ser registrada em `historico_pedido`.
6. A integração com o caixa e a cobrança devem ser definidas com o restaurante; no piloto o módulo pode operar isoladamente.

## Perfis

- **Garçom:** atendimento, pedidos e atualização operacional permitida.
- **Limpeza:** início e conclusão de limpeza.
- **Gestor:** configurações administrativas, custos e equipamentos.

As permissões devem ser aplicadas na camada de serviço/banco, não apenas ocultando botões na interface.
