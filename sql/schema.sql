-- Tabela unica. Uma linha por TENTATIVA, nunca por exercicio.
-- O valor do banco esta em guardar as tentativas ERRADAS: e delas que sai a curva.
--
-- Nao ha coluna de usuario nem de maquina, e isso e deliberado: e um aluno so, e a
-- graca e justamente que faculdade, casa e notebook caiam todos na MESMA tabela.
create table if not exists tentativas (
  id           bigserial primary key,
  trilha       text        not null,          -- 'ts' | 'js' | 'teoria'
  exercicio    text        not null,          -- '1' .. '11' | 'bonus' | 'E1' ...
  resposta     text        not null,          -- o que ele escreveu, cru
  acertou      boolean     not null,
  erros        jsonb       not null default '[]'::jsonb,
  ms_pensando  integer,                       -- do foco no editor ate o submit
  nota         text,                          -- so na trilha teoria: expliquei | faltou | nao-soube
  usou_sintaxe boolean     not null default false,
  -- CARIMBO DO CLIENTE, nao do servidor. Com `default now()` a mesma tentativa ficava
  -- com dois horarios (o do localStorage e o do banco, milissegundos depois) e a pagina
  -- nao conseguia reconhecer no banco o que ela mesma tinha escrito. A API manda o
  -- horario da pagina e so cai no now() se ele vier invalido.
  criado_em    timestamptz not null default now()
);

create index if not exists tentativas_ex_idx  on tentativas (trilha, exercicio, criado_em);
create index if not exists tentativas_dia_idx on tentativas (criado_em);

-- Chave natural da tentativa. E ela que faz a autoavaliacao da trilha Teoria ATUALIZAR
-- a entrega em vez de criar uma segunda linha com o mesmo conteudo, e e ela que deixa a
-- pagina casar historico local com historico do banco por igualdade.
create unique index if not exists tentativas_chave_idx on tentativas (trilha, exercicio, criado_em);

-- Nao precisa rodar isto na mao a cada mudanca: `api/tentativas.js` aplica as colunas
-- e o indice acima uma vez por instancia fria, e cai no formato antigo se nao conseguir.
