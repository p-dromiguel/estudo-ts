// Vercel serverless function. POST grava uma tentativa, GET devolve o historico.
// Sem DATABASE_URL configurada, responde 200 com { salvo: false } e a pagina cai
// no localStorage sozinha. Isso e de proposito: o app tem que funcionar antes do banco existir.
//
// O CARIMBO DE HORA VEM DO CLIENTE (04/09/2026). Antes a coluna usava `default now()`,
// o horario do servidor — alguns milissegundos depois do horario que a pagina ja tinha
// gravado no localStorage. Resultado: a MESMA tentativa tinha dois horarios diferentes
// dos dois lados, e nao havia como a pagina reconhecer no banco o que ela mesma escreveu.
// Com o carimbo do cliente os dois lados batem exatamente, e a sincronizacao vira
// comparacao de igualdade em vez de adivinhacao.
const { neon } = require('@neondatabase/serverless');

// Migracao no proprio codigo, uma vez por instancia fria. E' uma tabela so, de um
// aluno so: pedir pra rodar SQL no console do Neon a cada mudanca e' garantir que
// producao e codigo saiam de sincronia. Se qualquer passo falhar, `esquemaOk` fica
// falso e a gravacao continua pelo caminho antigo — nunca deixa de gravar por isso.
let esquemaOk = null;
async function garantirEsquema(sql) {
  if (esquemaOk !== null) return esquemaOk;
  try {
    await sql`alter table tentativas add column if not exists nota text`;
    await sql`alter table tentativas add column if not exists usou_sintaxe boolean not null default false`;
    // Chave natural da tentativa. E' ela que faz a autoavaliacao da trilha Teoria
    // ATUALIZAR a entrega em vez de criar uma segunda linha com o mesmo conteudo.
    await sql`create unique index if not exists tentativas_chave_idx on tentativas (trilha, exercicio, criado_em)`;
    esquemaOk = true;
  } catch (e) {
    esquemaOk = false;
  }
  return esquemaOk;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const url = process.env.DATABASE_URL;
  if (!url) return res.status(200).json({ salvo: false, motivo: 'DATABASE_URL nao configurada' });

  const sql = neon(url);

  try {
    const completo = await garantirEsquema(sql);

    if (req.method === 'POST') {
      const b = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      if (!b.trilha || !b.exercicio || typeof b.resposta !== 'string') {
        return res.status(400).json({ erro: 'faltou trilha, exercicio ou resposta' });
      }
      // carimbo invalido nao derruba a gravacao: cai no now() do banco
      const quando = b.criado_em && !isNaN(Date.parse(b.criado_em))
        ? new Date(b.criado_em).toISOString() : null;
      const erros = JSON.stringify(b.erros || []);
      const ms = b.ms_pensando ?? null;

      if (!completo) {
        const [linha] = await sql`
          insert into tentativas (trilha, exercicio, resposta, acertou, erros, ms_pensando, criado_em)
          values (${b.trilha}, ${b.exercicio}, ${b.resposta}, ${!!b.acertou},
                  ${erros}::jsonb, ${ms}, coalesce(${quando}::timestamptz, now()))
          returning id, criado_em`;
        return res.status(200).json({ salvo: true, id: linha.id, criado_em: linha.criado_em, esquema: 'antigo' });
      }

      const [linha] = await sql`
        insert into tentativas (trilha, exercicio, resposta, acertou, erros, ms_pensando, nota, usou_sintaxe, criado_em)
        values (${b.trilha}, ${b.exercicio}, ${b.resposta}, ${!!b.acertou},
                ${erros}::jsonb, ${ms}, ${b.nota ?? null}, ${!!b.usouSintaxe},
                coalesce(${quando}::timestamptz, now()))
        on conflict (trilha, exercicio, criado_em) do update set
          resposta = excluded.resposta, acertou = excluded.acertou, erros = excluded.erros,
          ms_pensando = excluded.ms_pensando, nota = excluded.nota, usou_sintaxe = excluded.usou_sintaxe
        returning id, criado_em`;
      return res.status(200).json({ salvo: true, id: linha.id, criado_em: linha.criado_em });
    }

    if (req.method === 'GET') {
      const limite = Math.min(parseInt(req.query.limite, 10) || 300, 1000);
      const linhas = completo
        ? await sql`
            select trilha, exercicio, resposta, acertou, erros, ms_pensando, nota, usou_sintaxe, criado_em
            from tentativas order by criado_em desc, id desc limit ${limite}`
        : await sql`
            select trilha, exercicio, resposta, acertou, erros, ms_pensando, criado_em
            from tentativas order by criado_em desc, id desc limit ${limite}`;
      return res.status(200).json({ total: linhas.length, tentativas: linhas });
    }

    return res.status(405).json({ erro: 'metodo nao suportado' });
  } catch (e) {
    return res.status(500).json({ erro: String(e && e.message ? e.message : e) });
  }
};
