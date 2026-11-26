-- Plataforma de Controle de Consumo e Atendimento para Restaurante por Quilo
-- PostgreSQL / Supabase compatible. Execute uma única vez em banco vazio.
-- O vínculo funcionario.auth_user_id guarda o ID do provedor de autenticação;
-- a autenticação propriamente dita permanece sob responsabilidade do Supabase Auth/JWT.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE ingrediente (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome varchar(120) NOT NULL,
  categoria varchar(80),
  custo_por_kg numeric(12,2) NOT NULL DEFAULT 0 CHECK (custo_por_kg >= 0),
  ativo boolean NOT NULL DEFAULT true,
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE funcionario (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome varchar(160) NOT NULL,
  perfil varchar(20) NOT NULL CHECK (perfil IN ('garcom', 'limpeza', 'gestor')),
  auth_user_id uuid UNIQUE,
  ativo boolean NOT NULL DEFAULT true,
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE cuba (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ingrediente_id uuid NOT NULL REFERENCES ingrediente(id),
  codigo varchar(40) NOT NULL UNIQUE,
  zona_buffet varchar(100),
  capacidade_g integer NOT NULL CHECK (capacidade_g > 0),
  tipo_instalacao varchar(20) NOT NULL CHECK (tipo_instalacao IN ('travessa_solta', 'embutida')),
  ativa boolean NOT NULL DEFAULT true,
  fator_calibracao numeric(14,6),
  calibrada_em timestamptz,
  criado_em timestamptz NOT NULL DEFAULT now(),
  CHECK (NOT ativa OR (fator_calibracao IS NOT NULL AND calibrada_em IS NOT NULL))
);

CREATE TABLE leitura_peso (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cuba_id uuid NOT NULL REFERENCES cuba(id),
  peso_g numeric(12,2) NOT NULL CHECK (peso_g >= 0),
  registrado_em timestamptz NOT NULL DEFAULT now(),
  qualidade_sinal varchar(20) NOT NULL CHECK (qualidade_sinal IN ('estavel', 'instavel', 'amostra')),
  origem_dispositivo varchar(80)
);

CREATE TABLE evento_cuba (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cuba_id uuid NOT NULL REFERENCES cuba(id),
  tipo varchar(20) NOT NULL CHECK (tipo IN ('retirada', 'reposicao', 'ajuste')),
  quantidade_g integer NOT NULL CHECK (quantidade_g > 0),
  origem varchar(20) NOT NULL CHECK (origem IN ('sensor', 'manual')),
  funcionario_id uuid REFERENCES funcionario(id),
  registrado_em timestamptz NOT NULL DEFAULT now(),
  id_evento_dispositivo varchar(120) UNIQUE
);

CREATE TABLE zona (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome varchar(80) NOT NULL UNIQUE,
  ordem_exibicao integer NOT NULL DEFAULT 0
);

CREATE TABLE mesa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zona_id uuid NOT NULL REFERENCES zona(id),
  codigo varchar(30) NOT NULL UNIQUE,
  capacidade integer NOT NULL CHECK (capacidade > 0),
  posicao_x numeric(8,2),
  posicao_y numeric(8,2),
  estado varchar(20) NOT NULL DEFAULT 'disponivel'
    CHECK (estado IN ('disponivel', 'ocupada', 'em_limpeza', 'indisponivel')),
  criada_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE atendimento_mesa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mesa_id uuid NOT NULL REFERENCES mesa(id),
  funcionario_id uuid NOT NULL REFERENCES funcionario(id),
  quantidade_pessoas integer NOT NULL CHECK (quantidade_pessoas > 0),
  inicio timestamptz NOT NULL DEFAULT now(),
  fim timestamptz,
  CHECK (fim IS NULL OR fim >= inicio)
);

CREATE TABLE limpeza (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mesa_id uuid NOT NULL REFERENCES mesa(id),
  funcionario_id uuid NOT NULL REFERENCES funcionario(id),
  inicio timestamptz NOT NULL DEFAULT now(),
  fim timestamptz,
  CHECK (fim IS NULL OR fim >= inicio)
);

CREATE TABLE comanda (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mesa_id uuid NOT NULL REFERENCES mesa(id),
  codigo_qr varchar(160) NOT NULL UNIQUE,
  status varchar(20) NOT NULL DEFAULT 'aberta'
    CHECK (status IN ('aberta', 'prato_pronto', 'encerrada', 'cancelada')),
  aviso_prato_pronto_em timestamptz,
  criada_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE item_cardapio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome varchar(120) NOT NULL,
  categoria varchar(60) NOT NULL DEFAULT 'bebida',
  preco numeric(10,2) NOT NULL CHECK (preco >= 0),
  disponivel boolean NOT NULL DEFAULT true,
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE pedido_bebida (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comanda_id uuid NOT NULL REFERENCES comanda(id),
  item_cardapio_id uuid NOT NULL REFERENCES item_cardapio(id),
  quantidade integer NOT NULL DEFAULT 1 CHECK (quantidade > 0),
  observacao varchar(500),
  status varchar(20) NOT NULL DEFAULT 'recebido'
    CHECK (status IN ('recebido', 'em_preparo', 'entregue', 'cancelado')),
  pedido_em timestamptz NOT NULL DEFAULT now(),
  entregue_em timestamptz
);

CREATE TABLE historico_pedido (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_bebida_id uuid NOT NULL REFERENCES pedido_bebida(id) ON DELETE CASCADE,
  status varchar(20) NOT NULL
    CHECK (status IN ('recebido', 'em_preparo', 'entregue', 'cancelado')),
  funcionario_id uuid REFERENCES funcionario(id),
  alterado_em timestamptz NOT NULL DEFAULT now()
);

-- Índices para consultas frequentes por período, status e relacionamentos.
CREATE INDEX idx_leitura_peso_cuba_data ON leitura_peso(cuba_id, registrado_em DESC);
CREATE INDEX idx_evento_cuba_cuba_data ON evento_cuba(cuba_id, registrado_em DESC);
CREATE INDEX idx_evento_cuba_tipo_data ON evento_cuba(tipo, registrado_em DESC);
CREATE INDEX idx_mesa_zona_estado ON mesa(zona_id, estado);
CREATE INDEX idx_atendimento_mesa_data ON atendimento_mesa(mesa_id, inicio DESC);
CREATE INDEX idx_limpeza_mesa_data ON limpeza(mesa_id, inicio DESC);
CREATE INDEX idx_pedido_status_data ON pedido_bebida(status, pedido_em DESC);
CREATE INDEX idx_historico_pedido_data ON historico_pedido(pedido_bebida_id, alterado_em);

-- Impede que uma mesa seja marcada como disponível enquanto houver limpeza aberta.
CREATE OR REPLACE FUNCTION validar_liberacao_mesa()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.estado = 'disponivel' AND EXISTS (
    SELECT 1 FROM limpeza l
    WHERE l.mesa_id = NEW.id AND l.fim IS NULL
  ) THEN
    RAISE EXCEPTION 'A mesa só pode ficar disponível após a conclusão da limpeza.';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validar_liberacao_mesa
BEFORE UPDATE OF estado ON mesa
FOR EACH ROW EXECUTE FUNCTION validar_liberacao_mesa();

-- Ao concluir a limpeza, libera a mesa somente se não houver outra limpeza aberta.
CREATE OR REPLACE FUNCTION finalizar_limpeza_atualizar_mesa()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.fim IS NOT NULL AND OLD.fim IS NULL THEN
    UPDATE mesa
       SET estado = 'disponivel'
     WHERE id = NEW.mesa_id
       AND NOT EXISTS (
         SELECT 1 FROM limpeza l
         WHERE l.mesa_id = NEW.mesa_id AND l.id <> NEW.id AND l.fim IS NULL
       );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_finalizar_limpeza_atualizar_mesa
AFTER UPDATE OF fim ON limpeza
FOR EACH ROW EXECUTE FUNCTION finalizar_limpeza_atualizar_mesa();

-- Atualiza automaticamente a data de entrega ao mudar o status para entregue.
CREATE OR REPLACE FUNCTION marcar_entrega_pedido()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status = 'entregue' AND OLD.status <> 'entregue' THEN
    NEW.entregue_em := COALESCE(NEW.entregue_em, now());
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_marcar_entrega_pedido
BEFORE UPDATE OF status ON pedido_bebida
FOR EACH ROW EXECUTE FUNCTION marcar_entrega_pedido();
