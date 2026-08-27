// Vercel serverless function. POST grava uma tentativa, GET devolve o historico.
// Sem DATABASE_URL configurada, responde 200 com { salvo: false } e a pagina cai
// no localStorage sozinha. Isso e de proposito: o app tem que funcionar antes do banco existir.
const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const url = process.env.DATABASE_URL;
  if (!url) return res.status(200).json({ salvo: false, motivo: 'DATABASE_URL nao configurada' });

  const sql = neon(url);

  try {
    if (req.method === 'POST') {
      const b = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      if (!b.trilha || !b.exercicio || typeof b.resposta !== 'string') {
        return res.status(400).json({ erro: 'faltou trilha, exercicio ou resposta' });
      }
      const [linha] = await sql`
        insert into tentativas (trilha, exercicio, resposta, acertou, erros, ms_pensando)
        values (${b.trilha}, ${b.exercicio}, ${b.resposta}, ${!!b.acertou},
                ${JSON.stringify(b.erros || [])}::jsonb, ${b.ms_pensando ?? null})
        returning id, criado_em`;
      return res.status(200).json({ salvo: true, id: linha.id, criado_em: linha.criado_em });
    }

    if (req.method === 'GET') {
      const limite = Math.min(parseInt(req.query.limite, 10) || 300, 1000);
      const linhas = await sql`
        select trilha, exercicio, resposta, acertou, erros, ms_pensando, criado_em
        from tentativas order by criado_em desc limit ${limite}`;
      return res.status(200).json({ total: linhas.length, tentativas: linhas });
    }

    return res.status(405).json({ erro: 'metodo nao suportado' });
  } catch (e) {
    return res.status(500).json({ erro: String(e && e.message ? e.message : e) });
  }
};
