-- Tabela unica. Uma linha por TENTATIVA, nunca por exercicio.
-- O valor do banco esta em guardar as tentativas ERRADAS: e delas que sai a curva.
create table if not exists tentativas (
  id           bigserial primary key,
  trilha       text        not null,          -- 'ts' | 'js'
  exercicio    text        not null,          -- '1' .. '7' | 'bonus'
  resposta     text        not null,          -- o que ele escreveu, cru
  acertou      boolean     not null,
  erros        jsonb       not null default '[]'::jsonb,
  ms_pensando  integer,                       -- do foco no editor ate o submit
  criado_em    timestamptz not null default now()
);

create index if not exists tentativas_ex_idx  on tentativas (trilha, exercicio, criado_em);
create index if not exists tentativas_dia_idx on tentativas (criado_em);
