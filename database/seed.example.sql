-- Dados fictícios para ambiente local/demonstração. Não representam restaurante real.
INSERT INTO ingrediente (nome, categoria, custo_por_kg)
VALUES
  ('Arroz branco', 'acompanhamento', 8.50),
  ('Carne assada', 'proteina', 32.00),
  ('Batata assada', 'acompanhamento', 14.00);

INSERT INTO funcionario (nome, perfil)
VALUES
  ('Funcionário Demonstração', 'garcom'),
  ('Equipe de Limpeza Demo', 'limpeza'),
  ('Gestor Demonstração', 'gestor');

INSERT INTO zona (nome, ordem_exibicao)
VALUES ('Salão principal', 1), ('Varanda', 2);

INSERT INTO mesa (zona_id, codigo, capacidade, posicao_x, posicao_y)
SELECT id, 'M01', 4, 1, 1 FROM zona WHERE nome = 'Salão principal'
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO item_cardapio (nome, categoria, preco)
VALUES
  ('Água sem gás', 'bebida', 4.00),
  ('Suco natural', 'bebida', 8.00),
  ('Refrigerante lata', 'bebida', 6.50);
