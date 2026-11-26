# Indicadores do painel do gestor

Os indicadores devem ser apresentados com filtros por data e turno. Metas só devem ser definidas após medir a linha de base da operação.

| Indicador | Origem | Observação |
|---|---|---|
| Saída por ingrediente/turno | evento_cuba + ingrediente | Separar retirada, reposição e ajuste |
| Custo estimado da saída | evento_cuba + ingrediente.custo_por_kg | (gramas / 1000) × custo/kg |
| Diferença balança x pesagem manual | validação do piloto | Registrar método e amostra |
| Tempo pedido-entrega | pedido_bebida.pedido_em/entregue_em | Excluir cancelados |
| Tempo de limpeza | limpeza.inicio/fim | Analisar por turno e volume |
| Ocupação por faixa horária | mesa + atendimento_mesa | Não expor dados pessoais |
| Reposição por ingrediente | evento_cuba | Considerar somente tipo reposicao |

A medição de saída da cuba é uma estimativa operacional. Para margem real, será necessário cruzar os dados com compras e estoque. Não usar esses dados para ranking individual de funcionários.
