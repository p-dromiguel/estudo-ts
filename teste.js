#!/usr/bin/env node
'use strict';
// A rede que faltava.  Uso:  node teste.js
//
// Roda o CAMINHO DO ALUNO, nao as pecas: carrega o mesmo exercicios.js, o mesmo
// corretor do app.js e baixa as MESMAS libs que o navegador baixa. Se o app estiver
// quebrado, isto quebra junto — que e' o ponto.
//
// Nasceu em 03/09/2026 depois de tres defeitos seguidos, todos descobertos pelo aluno:
//   1. js/6: mensagem "esperava X, veio null" quando o que faltava era `return`
//   2. trilha TS inteira recusando a resposta certa (as definicoes baixavam vazias)
//   3. ts/5: enunciado ambiguo, e o erro util era o terceiro da lista
// Nenhum tinha como ser pego antes, porque nenhum exercicio sabia a propria resposta.
//
// O que ele exige, para cada um dos 20 exercicios:
//   - existe gabarito                    (sem isso, nao da pra afirmar nada)
//   - a resposta CERTA passa             (era o defeito 2)
//   - as respostas ERRADAS sao recusadas (senao o exercicio nao prova nada)
//   - a mensagem contem a dica esperada  (era o defeito 1 e 3)
//   - existe dica de sintaxe e ela nao vaza a resposta

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = __dirname;
const ler = f => fs.readFileSync(path.join(RAIZ, f), 'utf8');

// ---------- monta o mesmo ambiente do navegador ----------
const ts = (() => {
  try { return require('typescript'); }
  catch (e) {
    try { return require(path.join(RAIZ, '..', 'contrato-honorarios', 'node_modules', 'typescript')); }
    catch (e2) { return null; }
  }
})();

const LIBS = [
  'lib.es5.d.ts', 'lib.es2015.core.d.ts', 'lib.es2015.collection.d.ts',
  'lib.es2016.array.include.d.ts', 'lib.es2017.object.d.ts',
];

async function baixarLib() {
  const base = 'https://unpkg.com/typescript@5.9.3/lib/';
  const partes = await Promise.all(LIBS.map(a =>
    fetch(base + a).then(r => (r.status === 200 ? r.text() : '')).catch(() => '')));
  return partes.join('\n').replace(/\/\/\/\s*<reference\s+lib=[^>]*>/g, '');
}

/** Executa exercicios.js, sintaxe.js e as funcoes puras do app.js num contexto so. */
function montarApp(lib) {
  const ctx = { ts, lib, console, module: { exports: {} } };
  vm.createContext(ctx);
  vm.runInContext(ler('exercicios.js'), ctx);
  vm.runInContext(ler('sintaxe.js'), ctx);
  // do app.js so as funcoes puras: para antes do primeiro acesso ao DOM
  const app = ler('app.js');
  const corte = app.indexOf('/* ---------- dicas de sintaxe');
  vm.runInContext(app.slice(0, corte), ctx);
  // O app.js declara `var lib = null` no topo e sobrescreve o que injetamos —
  // por isso a lib entra DEPOIS, igual ao que o navegador faz quando o fetch volta.
  ctx.lib = lib;
  return ctx;
}

// ---------- os testes ----------
const falhas = [];
function conferir(nome, cond, detalhe) {
  if (cond) return;
  falhas.push(nome + (detalhe ? '  [' + String(detalhe).slice(0, 130) + ']' : ''));
}

(async () => {
  if (!ts) {
    console.error('typescript nao encontrado. rode `npm i` (ou tenha o contrato-honorarios ao lado).');
    process.exit(1);
  }

  process.stdout.write('baixando as definicoes do TypeScript (as mesmas do navegador)... ');
  const lib = await baixarLib();
  console.log(lib.length + ' bytes');

  const ctx = montarApp(lib);
  const GABARITO = require('./gabarito.js');
  const { EXERCICIOS, SINTAXE } = ctx;

  // 0. a lib precisa estar boa — este e' o teste que teria pego o defeito 2
  const sanidade = ctx.checarTS('const n: number = 1;\nconst l: string[] = ["a"];\nconst ok: boolean = l.every(function(x){ return x.length > n; });');
  conferir('as definicoes do TypeScript carregam de verdade', sanidade.length === 0, sanidade[0]);
  if (sanidade.length) {
    console.log('\nA lib nao carregou. Todo o resto falharia por tabela — parando aqui.');
    console.log('  ' + falhas.join('\n  '));
    process.exit(1);
  }

  let total = 0;
  for (const trilha of ['ts', 'js']) {
    console.log('\n--- trilha ' + trilha + ' ---');
    for (const ex of EXERCICIOS[trilha]) {
      const chave = trilha + ':' + ex.id;
      const g = GABARITO[chave];
      total++;

      if (!g) { falhas.push(chave + ': SEM GABARITO — nao da pra afirmar que funciona'); console.log('  XX  ' + chave + '  sem gabarito'); continue; }

      const corrige = resp => (trilha === 'ts'
        ? (() => { let e = ctx.checarTS(ex.contexto(resp)); if (e.length) e = ctx.dicasDeTS(resp, e).concat(e); return e; })()
        : ctx.checarJS(ex, resp));

      const dCerta = corrige(g.certa);
      conferir(chave + ': a resposta certa deveria passar', dCerta.length === 0, dCerta[0]);

      let okErradas = true;
      for (const err of (g.erradas || [])) {
        const d = corrige(err.resp);
        if (d.length === 0) { conferir(chave + ': resposta errada PASSOU (o exercicio nao prova nada): ' + err.resp.slice(0, 40), false); okErradas = false; continue; }
        if (err.espera) {
          const achou = d.join(' | ').indexOf(err.espera) >= 0;
          conferir(chave + ': a mensagem deveria conter "' + err.espera + '"', achou, d[0]);
          if (!achou) okErradas = false;
        }
      }

      // dica de sintaxe: existe e nao entrega a resposta
      const dica = SINTAXE[chave];
      conferir(chave + ': sem dica de sintaxe', !!dica);
      if (dica) {
        // Compara a resposta INTEIRA normalizada, nao a primeira linha: no ts:bonus
        // a primeira linha e' so `interface Contrato {`, que a dica mostra de propósito
        // com campos de exemplo — isso ensina a forma sem entregar os campos certos.
        const norm = s => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        conferir(chave + ': a DICA ENTREGA a resposta inteira',
          norm(dica).indexOf(norm(g.certa)) < 0, norm(g.certa).slice(0, 60));
      }

      const ok = dCerta.length === 0 && okErradas;
      console.log('  ' + (ok ? 'ok  ' : 'XX  ') + chave + '  ' + g.certa.split('\n')[0].slice(0, 58));
    }
  }

  // teoria: gabarito e pontos de cobertura existem
  console.log('\n--- trilha teoria ---');
  let teoriaRuins = 0;
  for (const q of EXERCICIOS.teoria) {
    if (!q.gabarito || !q.pontos || !q.pontos.length) { falhas.push('teoria:' + q.id + ': sem gabarito ou sem pontos'); teoriaRuins++; }
    // duck typing, nao `instanceof RegExp`: dentro do vm o construtor e' outro
    // e o instanceof daria falso negativo em todos.
    for (const p of (q.pontos || [])) if (!p.rx || typeof p.rx.test !== 'function') { falhas.push('teoria:' + q.id + ': ponto sem regex'); teoriaRuins++; }
  }
  console.log('  ' + (teoriaRuins ? 'XX  ' : 'ok  ') + EXERCICIOS.teoria.length + ' questoes com gabarito e pontos');

  console.log('\n' + '='.repeat(64));
  if (!falhas.length) {
    console.log(`TUDO CERTO — ${total} exercicios aceitam a resposta certa, recusam as erradas`);
    console.log('e dizem algo util quando recusam.');
    process.exit(0);
  }
  console.log(falhas.length + ' PROBLEMA(S):');
  for (const f of falhas) console.log('  - ' + f);
  process.exit(1);
})();
