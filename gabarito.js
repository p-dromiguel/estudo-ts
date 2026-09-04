// GABARITO — a resposta certa de cada exercicio, e os erros tipicos.
//
// ⚠ A PAGINA NAO CARREGA ESTE ARQUIVO. Ele existe so para o `node teste.js`.
// O index.html carrega exercicios.js, sintaxe.js e app.js — nunca este.
//
// Por que existe (03/09/2026): em tres horas apareceram tres defeitos, todos
// descobertos pelo aluno gastando tentativa:
//   - js/6  : a mensagem dizia "esperava X, veio null" quando faltava `return`,
//             igualzinho ao que diria se a logica estivesse errada. 13 tentativas.
//   - ts/*  : a trilha INTEIRA recusava ate a resposta certa, porque as definicoes
//             do TypeScript baixavam vazias. 4 tentativas numa resposta correta.
//   - ts/5  : o enunciado deixava entender que era pra escrever a interface toda.
//
// A causa raiz nao era nenhum deles: era o exercicio nao saber qual e a propria
// resposta. Sem gabarito, nenhuma maquina consegue perguntar "isto aceita o certo?".
//
// Formato:
//   certa   : resposta que TEM que dar zero erro
//   erradas : [{ resp, espera }] — `resp` tem que ser recusada, e a mensagem
//             precisa conter `espera` (a dica que salva o aluno). `espera` null
//             significa "basta recusar".

var GABARITO = {

// ---------------- TypeScript ----------------
'ts:1': { certa: 'function estaParado(dias: number) {', erradas: [
  { resp: 'function estaParado(dias) {', espera: 'implicitly has an' },
  { resp: 'function estaParado(dias: string) {', espera: null },
]},
'ts:2': { certa: 'function ehDoGlecio(responsavel: string) {', erradas: [
  { resp: 'function ehDoGlecio(responsavel) {', espera: 'implicitly has an' },
  { resp: 'function ehDoGlecio(responsavel: number) {', espera: 'trim' },
]},
'ts:3': { certa: 'function faltaAlgum(itens: string[]) {', erradas: [
  { resp: 'function faltaAlgum(itens) {', espera: 'implicitly has an' },
  { resp: 'function faltaAlgum(itens: string) {', espera: 'some' },
]},
'ts:4': { certa: 'function temResponsavel(nome: string | null) {', erradas: [
  { resp: 'function temResponsavel(nome) {', espera: 'implicitly has an' },
  { resp: 'function temResponsavel(nome: string) {', espera: 'null' },
]},
'ts:5': { certa: 'advbox_customer_id: number | null;', erradas: [
  { resp: 'interface Contrato {\n  advbox_customer_id: number | null;\n}', espera: 'interface INTEIRA' },
  { resp: 'c.advbox_customer_id: number | null;', espera: 'sobrando' },
  { resp: 'advbox_customer_id: number;', espera: 'barra em pe' },
]},
'ts:6': { certa: 'advbox_lawsuit_id: number | null;', erradas: [
  { resp: 'advbox_lawsuit_id: number;', espera: null },
]},
'ts:7': { certa: 'responsavel_juridico: string | null;', erradas: [
  { resp: 'responsavel_juridico: number | null;', espera: null },
]},
// ⚠ LIMITE REAL DO TYPESCRIPT, descoberto por esta suite em 03/09: o retorno sem
// anotacao e' INFERIDO, entao `function checklistCompleto(contrato: Contrato) {`
// compila igual. Nao da pra provar a anotacao de retorno pelo compilador — anotar
// e' boa pratica, nao exigencia. O exercicio vale pela forma; o que ele consegue
// provar de fato e' o tipo do parametro.
'ts:8': { certa: 'function checklistCompleto(contrato: Contrato): boolean {', erradas: [
  { resp: 'function checklistCompleto(contrato): boolean {', espera: 'implicitly has an' },
  { resp: 'function checklistCompleto(contrato: Contrato): string {', espera: null },
]},
'ts:9': { certa: 'function derivarEtapaPosVenda(contrato: Contrato) {', erradas: [
  { resp: 'function derivarEtapaPosVenda(contrato) {', espera: 'implicitly has an' },
]},
'ts:10': { certa: 'function derivarEtapaPosVenda(contrato: Contrato): { etapa: string; motivo: string | null } {', erradas: [
  { resp: 'function derivarEtapaPosVenda(contrato: Contrato): { etapa: string } {', espera: null },
]},
'ts:11': { certa: 'onboarding_checklist: Record<string, true | "na">;', erradas: [
  { resp: 'onboarding_checklist: Record<string, boolean>;', espera: null },
]},
'ts:bonus': { certa: [
  'interface Contrato {',
  '  conclusao_manual: { estado: string } | null;',
  '  onboarding_aguardando_docs?: { ativo: boolean } | null;',
  '  reaberto?: boolean;',
  '  dados?: { reaberto: boolean };',
  '  primeiro_pagamento_recebido: boolean;',
  '}',
].join('\n'), erradas: [
  { resp: 'interface Contrato { primeiro_pagamento_recebido: boolean; }', espera: null },
]},

// ---------------- JavaScript ----------------
'js:1': { certa: 'const cm = contrato.conclusao_manual;', erradas: [
  { resp: 'const cm = contrato.conclusao_manual', espera: 'falta o ;' },
]},
'js:2': { certa: 'contrato.onboarding_checklist || {}', erradas: [
  { resp: 'contrato.onboarding_checklist', espera: null },
]},
'js:3': { certa: 'const v = (contrato.onboarding_checklist || {})[item];', erradas: [
  { resp: 'const v = (contrato.onboarding_checklist || {}).item;', espera: null },
]},
'js:4': { certa: 'const reaberto = !!(contrato.reaberto || (contrato.dados && contrato.dados.reaberto));', erradas: [
  { resp: 'const reaberto = contrato.reaberto;', espera: null },
]},
'js:5': { certa: 'ONBOARDING_ITENS.every(item => itemResolvido(contrato, item))', erradas: [
  { resp: 'ONBOARDING_ITENS.some(item => itemResolvido(contrato, item))', espera: null },
]},
'js:6': { certa: "if (cm && cm.estado === 'confirmado') return { etapa: 'concluido', motivo: 'manual' };", erradas: [
  // a tentativa 7 dele, em 02/09: logica certa, sem return
  { resp: "cm && cm.estado === 'confirmado' ? { etapa: 'concluido', motivo: 'manual' } : undefined;", espera: 'NAO DEVOLVE' },
  // a tentativa 1: if e return certos, mas [ ] no lugar de { } e sem aspas
  { resp: "if (cm !== null && cm.estado === 'confirmado') return [etapa: concluido, motivo: manual];", espera: 'LISTA' },
]},
'js:7': { certa: 'ONBOARDING_ITENS.filter(item => !itemResolvido(contrato, item))', erradas: [
  { resp: 'ONBOARDING_ITENS.filter(item => itemResolvido(contrato, item))', espera: null },
]},
'js:bonus': { certa: 'function temPrazoVencido(tarefa) {\n  return !!(tarefa.prazo && !tarefa.concluida);\n}', erradas: [
  { resp: 'function temPrazoVencido(tarefa) {\n  return !!tarefa.prazo;\n}', espera: null },
]},

};

if (typeof module !== 'undefined') module.exports = GABARITO;
