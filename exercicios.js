// Biblioteca de exercicios. Duas trilhas.
//
// TS  : cada exercicio monta um arquivo .ts completo e o COMPILADOR julga. Zero diagnostico = acertou.
//       Cada contexto carrega uma PROVA (ex: um `: null` la embaixo) que fecha a porta pra resposta pela metade.
// JS  : cada exercicio monta uma funcao e RODA com entradas conhecidas. Todos os testes passando = acertou.
//
// Os enunciados saem do sistema real dele (services/posvenda-etapa.js), nunca de tutorial.

var EXERCICIOS = {

ts: [
 // ---- o degrau zero: tipar UMA coisa, antes de existir interface ----
 // Estes 4 nasceram em 03/09/2026, quando ele disse: "sei escrever um hello world em
 // js, mas nao sei em ts". A trilha comecava direto em interface — nunca ensinou a
 // primeira linha. Cada um introduz UMA forma nova e nada mais.
 {id:'1', alvo:'a primeira linha de TypeScript da sua vida',
  html:'<p><b>Cenario:</b> esta funcao existe no seu sistema e o compilador reclama do <code>dias</code>:</p>'+
       '<pre>function estaParado(dias) {\n  return dias &gt; 14;\n}</pre>'+
       '<p><b>Escreve:</b> so a <b>primeira linha</b> dela, dizendo que <code>dias</code> e um numero.</p>'+
       '<div class="dica">a forma e <code>nome: tipo</code>, dentro do parenteses. numero e <code>number</code>. Nao precisa dizer o que a funcao devolve — isso e mais pra frente.</div>',
  contexto:function(r){return r+'\n  return dias > 14;\n}\n'+
       'const prova: boolean = estaParado(63);';}},

 {id:'2', alvo:'a mesma forma, agora com texto',
  html:'<p><b>Cenario:</b></p><pre>function ehDoGlecio(responsavel) {\n  return responsavel.trim() === "Glecio";\n}</pre>'+
       '<p><b>Escreve:</b> a primeira linha, dizendo que <code>responsavel</code> e um texto.</p>'+
       '<div class="dica">texto e <code>string</code>. Repara que o <code>.trim()</code> so existe porque e texto — e assim que o compilador passa a te ajudar.</div>',
  contexto:function(r){return r+'\n  return responsavel.trim() === "Glecio";\n}\n'+
       'const prova: boolean = ehDoGlecio(" Glecio ");';}},

 {id:'3', alvo:'forma nova: uma LISTA de textos',
  html:'<p><b>Cenario:</b> esta funcao recebe os itens do checklist de onboarding e diz se algum esta vazio:</p>'+
       '<pre>function faltaAlgum(itens) {\n  return itens.some(i =&gt; !i.trim());\n}</pre>'+
       '<p><b>Escreve:</b> a primeira linha, dizendo que <code>itens</code> e uma <b>lista de textos</b>.</p>'+
       '<div class="dica">lista de textos e <code>string[]</code>: o tipo do que vai dentro, seguido de colchetes.</div>',
  // Foi pedido como PARAMETRO de proposito. Se fosse `const ITENS = ["a","b"]`, o
  // TypeScript inferiria string[] sozinho e a resposta sem tipo passaria igual —
  // o exercicio nao provaria nada. Em parametro, faltar o tipo cai no noImplicitAny.
  contexto:function(r){return r+'\n  return itens.some(i => !i.trim());\n}\n'+
       'const prova: boolean = faltaAlgum(["docs_conferidos", ""]);';}},

 {id:'4', alvo:'forma nova: ou tem, ou nao tem (a barra em pe)',
  html:'<p><b>Cenario:</b> nem todo contrato tem responsavel — o campo chega como texto <b>ou</b> como <code>null</code>:</p>'+
       '<pre>function temResponsavel(nome) {\n  return !!nome;\n}</pre>'+
       '<p><b>Escreve:</b> a primeira linha, dizendo que <code>nome</code> pode ser um texto <b>ou</b> nada.</p>'+
       '<div class="dica">"ou" se escreve com a barra em pe: <code>tipo | outro</code>. Voce vai usar isso no resto da trilha inteira.</div>',
  contexto:function(r){return r+'\n  return !!nome;\n}\n'+
       'const p1: boolean = temResponsavel("Glecio");\n'+
       'const p2: boolean = temResponsavel(null);';}},

 {id:'5', alvo:'forma nova: | null e number',
  html:'<p><b>Cenario:</b> ja existe esta linha, que compara o campo com nada:</p>'+
       '<pre>contato_advbox: (c: Contrato) =&gt; c.advbox_customer_id != null</pre>'+
       '<p><b>Escreve:</b> a linha que declara esse campo dentro da <code>interface Contrato</code>. Ele e um numero, e pode nao ter valor nenhum.</p>'+
       '<div class="dica">numero e <code>number</code>. "ou nada" se escreve <code>| null</code>, com a barra em pe.</div>',
  contexto:function(r){return 'interface Contrato {\n  primeiro_pagamento_recebido: boolean;\n  '+r+'\n}\n'+
       'const usa = (c: Contrato) => c.advbox_customer_id != null;\n'+
       'const prova: Contrato = { primeiro_pagamento_recebido: true, advbox_customer_id: null };';}},

 {id:'6', alvo:'a mesma forma, segunda vez',
  html:'<p><b>Cenario:</b></p><pre>processo_advbox: (c: Contrato) =&gt; c.advbox_lawsuit_id != null</pre>'+
       '<p><b>Escreve:</b> a linha desse campo dentro da interface.</p>',
  contexto:function(r){return 'interface Contrato {\n  '+r+'\n}\n'+
       'const usa = (c: Contrato) => c.advbox_lawsuit_id != null;\n'+
       'const prova: Contrato = { advbox_lawsuit_id: null };';}},

 {id:'7', alvo:'a mesma forma, base diferente',
  html:'<p><b>Cenario:</b></p><pre>enviado_juridico: (c: Contrato) =&gt; !!c.responsavel_juridico</pre>'+
       '<p><b>Escreve:</b> a linha desse campo. Ele guarda o <b>nome</b> de quem e responsavel, e pode estar vazio.</p>'+
       '<div class="dica">texto e <code>string</code>.</div>',
  contexto:function(r){return 'interface Contrato {\n  '+r+'\n}\n'+
       'const usa = (c: Contrato) => !!c.responsavel_juridico;\n'+
       'const p1: Contrato = { responsavel_juridico: null };\n'+
       'const p2: Contrato = { responsavel_juridico: "Glecio" };';}},

 {id:'8', alvo:'forma nova: tipo de RETORNO',
  html:'<p><b>Cenario:</b> o compilador reclama do <code>contrato</code>:</p>'+
       '<pre>function checklistCompleto(contrato) {\n  return ONBOARDING_ITENS.every(item =&gt; itemResolvido(contrato, item));\n}</pre>'+
       '<p><b>Escreve:</b> so a primeira linha, dizendo o que o <code>contrato</code> e <b>e</b> o que a funcao devolve. Ela devolve um sim/nao.</p>'+
       '<div class="dica">o tipo do retorno vai <b>depois do fecha-parenteses</b>, antes da chave.</div>',
  contexto:function(r){return 'interface Contrato { primeiro_pagamento_recebido: boolean; }\n'+
       'const ONBOARDING_ITENS: string[] = [];\n'+
       'function itemResolvido(c: Contrato, item: string): boolean { return true; }\n'+
       r+'\n  return ONBOARDING_ITENS.every(item => itemResolvido(contrato, item));\n}\n'+
       'const prova: boolean = checklistCompleto({ primeiro_pagamento_recebido: true });';}},

 {id:'9', alvo:'repeticao do 4',
  html:'<p><b>Cenario:</b></p><pre>function derivarEtapaPosVenda(contrato) {</pre>'+
       '<p><b>Escreve:</b> essa linha dizendo so o que o <code>contrato</code> e. Deixa o retorno de fora, ele e o exercicio 6.</p>',
  contexto:function(r){return 'interface Contrato { primeiro_pagamento_recebido: boolean; }\n'+
       r+'\n  return { etapa: "concluido", motivo: null };\n}\n'+
       'const prova = derivarEtapaPosVenda({ primeiro_pagamento_recebido: true });';}},

 {id:'10', alvo:'forma nova: objeto como tipo de retorno',
  html:'<p><b>Cenario:</b> essa funcao sempre devolve um objeto com dois campos, e o <code>motivo</code> as vezes e nada:</p>'+
       '<pre>return { etapa: "concluido", motivo: "manual" };\nreturn { etapa: "a_confirmar", motivo: null };</pre>'+
       '<p><b>Escreve:</b> a mesma linha do 5, agora com o tipo de retorno tambem.</p>'+
       '<div class="dica">a forma de um objeto se escreve entre chaves, igual a uma interface, mas ali mesmo na linha: <code>{ campo: tipo; outro: tipo }</code></div>',
  contexto:function(r){return 'interface Contrato { primeiro_pagamento_recebido: boolean; }\n'+
       r+'\n  if (contrato.primeiro_pagamento_recebido) return { etapa: "concluido", motivo: "manual" };\n'+
       '  return { etapa: "comigo", motivo: null };\n}\n'+
       'const p = derivarEtapaPosVenda({ primeiro_pagamento_recebido: true });\n'+
       'const e: string = p.etapa;\nconst m: string | null = p.motivo;';}},

 {id:'11', alvo:'a dificil: chave que voce nao sabe qual e',
  html:'<p><b>Cenario:</b> o checklist e um objeto onde <b>as chaves sao os 8 itens</b> e cada valor e <code>true</code> ou o texto <code>na</code>:</p>'+
       '<pre>const v = (contrato.onboarding_checklist || {})[item];\nreturn v === true || v === "na";</pre>'+
       '<p><b>Escreve:</b> a linha desse campo dentro da interface. Voce nao sabe de antemao quais sao as chaves.</p>'+
       '<div class="dica"><code>Record&lt;string, X&gt;</code> significa "objeto de chave texto e valor X". E repara: um texto especifico, como <code>"na"</code>, tambem pode ser um tipo.</div>',
  contexto:function(r){return 'interface Contrato {\n  '+r+'\n}\n'+
       'function le(contrato: Contrato, item: string): boolean {\n'+
       '  const v = (contrato.onboarding_checklist || {})[item];\n'+
       '  return v === true || v === "na";\n}\n'+
       'const prova: Contrato = { onboarding_checklist: { docs_conferidos: true, boas_vindas: "na" } };';}},

 {id:'bonus', alvo:'fechar a interface sozinho, sem dica',
  html:'<p><b>Escreve:</b> a <code>interface Contrato</code> <b>inteira</b>, com todos os campos que a funcao abaixo usa, ate dar zero erro.</p>'+
       '<pre>const cm = contrato.conclusao_manual;\nif (cm &amp;&amp; cm.estado === "confirmado") ...\nconst docs = contrato.onboarding_aguardando_docs;\nconst bloqueio = !!(docs &amp;&amp; docs.ativo);\nconst reaberto = !!(contrato.reaberto || (contrato.dados &amp;&amp; contrato.dados.reaberto));\nconst pago = !!contrato.primeiro_pagamento_recebido;</pre>'+
       '<p>Aqui nao tem dica. Le o erro, olha como o campo e usado, decide o tipo.</p>',
  contexto:function(r){return r+'\n'+
       'function derivar(contrato: Contrato) {\n'+
       '  const cm = contrato.conclusao_manual;\n'+
       '  if (cm && cm.estado === "confirmado") return "concluido";\n'+
       '  const docs = contrato.onboarding_aguardando_docs;\n'+
       '  const bloqueio = !!(docs && docs.ativo);\n'+
       '  const reaberto = !!(contrato.reaberto || (contrato.dados && contrato.dados.reaberto));\n'+
       '  const pago = !!contrato.primeiro_pagamento_recebido;\n'+
       '  return bloqueio || reaberto || pago ? "comigo" : "aguardando";\n}\n'+
       'const prova: Contrato = { conclusao_manual: { estado: "confirmado" }, primeiro_pagamento_recebido: true };';}},
],

js: [
 {id:'1', alvo:'alvo: fechar o ;',
  html:'<p><b>Cenario:</b> a funcao recebe <code>contrato</code>. Dentro dele existe o campo <code>conclusao_manual</code>.</p>'+
       '<p><b>Escreve:</b> guarda esse campo numa constante de nome curto, <code>cm</code>.</p>',
  montar:function(r){return 'function f(contrato){ '+r+' return cm; }';},
  testes:[{args:[{conclusao_manual:{estado:'confirmado'}}], esperado:{estado:'confirmado'}},
          {args:[{}], esperado:undefined}]},

 {id:'2', alvo:'alvo: a rede de seguranca, sozinha',
  html:'<p><b>Cenario:</b> <code>contrato.onboarding_checklist</code> e o objeto com as marcacoes, mas pode nao existir.</p>'+
       '<p><b>Escreve:</b> uma <b>expressao</b> que devolva o checklist se ele existir, ou uma gaveta vazia se nao existir. So isso, nao abra nada ainda.</p>',
  montar:function(r){return 'function f(contrato){ return ('+r+'); }';},
  testes:[{args:[{onboarding_checklist:{a:true}}], esperado:{a:true}},
          {args:[{}], esperado:{}}]},

 {id:'3', alvo:'alvo: ponto x colchete',
  html:'<p><b>Cenario:</b> o mesmo checklist da 2, que pode nao existir. Existe tambem a variavel <code>item</code>, com o nome do item que se quer olhar.</p>'+
       '<p><b>Escreve:</b> guarda numa constante <code>v</code> a marcacao daquele item dentro do checklist, sem quebrar se o checklist nao existir.</p>',
  montar:function(r){return 'function f(contrato, item){ '+r+' return v; }';},
  testes:[{args:[{onboarding_checklist:{docs_conferidos:true}},'docs_conferidos'], esperado:true},
          {args:[{onboarding_checklist:{}},'boas_vindas'], esperado:undefined},
          {args:[{},'qualquer'], esperado:undefined}]},

 {id:'4', alvo:'alvo: OU + parenteses aninhados',
  html:'<p><b>Cenario:</b> a funcao recebe <code>contrato</code>.</p>'+
       '<p><b>Escreve:</b> guarda numa constante <code>reaberto</code> um <b>sim/nao de verdade</b> dizendo se o contrato foi reaberto. Pode estar marcado em <code>contrato.reaberto</code> ou dentro de <code>contrato.dados.reaberto</code>. Atencao: <code>dados</code> tambem pode nao existir.</p>',
  montar:function(r){return 'function f(contrato){ '+r+' return reaberto; }';},
  testes:[{args:[{reaberto:true}], esperado:true},
          {args:[{dados:{reaberto:true}}], esperado:true},
          {args:[{}], esperado:false},
          {args:[{dados:{}}], esperado:false}]},

 {id:'5', alvo:'alvo: callback com .every',
  html:'<p><b>Cenario:</b> existe a lista <code>ONBOARDING_ITENS</code> com os nomes do checklist, e a funcao <code>itemResolvido(contrato, item)</code>.</p>'+
       '<p><b>Escreve:</b> uma expressao que devolva sim/nao dizendo se <b>todos</b> os itens da lista estao resolvidos.</p>',
  montar:function(r){return 'function f(contrato, ONBOARDING_ITENS, itemResolvido){ return ('+r+'); }';},
  testes:[{args:[{ok:['a','b']},['a','b'],function(c,i){return c.ok.indexOf(i)>=0;}], esperado:true},
          {args:[{ok:['a']},['a','b'],function(c,i){return c.ok.indexOf(i)>=0;}], esperado:false}]},

 {id:'6', alvo:'alvo: guard clause + objeto no return',
  html:'<p><b>Cenario:</b> ja existe a constante <code>cm</code>, que ou e um objeto ou e nada.</p>'+
       '<p><b>Escreve:</b> a linha inteira. Se <code>cm</code> existir <b>e</b> o campo <code>estado</code> dele for o texto <code>confirmado</code>, devolve um objeto com dois campos: <code>etapa</code> valendo <code>concluido</code>, e <code>motivo</code> valendo <code>manual</code>. Tudo numa linha so, sem chaves de bloco.</p>',
  montar:function(r){return 'function f(cm){ '+r+' return null; }';},
  testes:[{args:[{estado:'confirmado'}], esperado:{etapa:'concluido',motivo:'manual'}},
          {args:[{estado:'a_confirmar'}], esperado:null},
          {args:[null], esperado:null}]},

 {id:'7', alvo:'alvo: callback + negacao',
  html:'<p><b>Cenario:</b> a mesma lista <code>ONBOARDING_ITENS</code> e a mesma funcao <code>itemResolvido(contrato, item)</code>.</p>'+
       '<p><b>Escreve:</b> uma expressao que devolva a lista <b>so dos itens que ainda NAO estao resolvidos</b>.</p>',
  montar:function(r){return 'function f(contrato, ONBOARDING_ITENS, itemResolvido){ return ('+r+'); }';},
  testes:[{args:[{ok:['a']},['a','b','c'],function(c,i){return c.ok.indexOf(i)>=0;}], esperado:['b','c']},
          {args:[{ok:['a','b','c']},['a','b','c'],function(c,i){return c.ok.indexOf(i)>=0;}], esperado:[]}]},

 {id:'bonus', alvo:'o portao 2: funcao inteira do zero',
  html:'<p>Nao e reescrever nada do seu sistema. E inventar do zero a partir do enunciado. <b>E a ultima condicao que falta pro portao 2 do seu placar</b>, e e o que um teste tecnico cobra de verdade.</p>'+
       '<p><b>Escreve a funcao</b> <code>temPrazoVencido(tarefa)</code>. Ela recebe uma tarefa e devolve sim/nao de verdade: verdadeiro <b>so quando</b> a tarefa tem um campo <code>prazo</code> preenchido <b>e</b> o campo <code>concluida</code> dela nao e verdadeiro.</p>',
  montar:function(r){return r+'\nvar f = temPrazoVencido;';},
  testes:[{args:[{prazo:'2026-08-01'}], esperado:true},
          {args:[{prazo:'2026-08-01', concluida:true}], esperado:false},
          {args:[{concluida:false}], esperado:false},
          {args:[{}], esperado:false},
          {args:[{prazo:'', concluida:false}], esperado:false}]},
],

// TEORIA: aqui nao ha compilador pra julgar. Voce escreve a explicacao COM SUAS PALAVRAS,
// entrega, e so entao ve o gabarito. A nota e sua — mas o `pontos` mostra o que voce
// deixou de fora, que e onde a entrevista costuma cutucar.
//
// Estas 6 primeiras nao sao aleatorias: sao o TESTE que ficou combinado em 01/09 pra
// decidir se TypeScript volta pro seu curriculo. Escrever TS voce ja escreve; o que
// faltava era sustentar em voz alta. Faca depois dos exercicios, nunca antes.
teoria: [
 {id:'1', alvo:'o teste do curriculo: type x interface',
  html:'<p>No <code>src-ts/services/cobranca-vinculo.ts</code> voce usou <b>os dois</b> no mesmo arquivo:</p>'+
       '<pre>export interface EntradaVinculo { ... }\nexport type ResultadoVinculo = { ok: true; ... } | { ok: false; ... };</pre>'+
       '<p><b>Explica:</b> por que a entrada virou <code>interface</code> e o resultado virou <code>type</code>? O que o <code>type</code> faz ali que a <code>interface</code> nao faria?</p>',
  pontos:[{rotulo:'que type consegue expressar uniao (o |)', rx:/uni[aã]o|\bunion\b|\bou\b|\|/i},
          {rotulo:'que interface descreve a forma de UM objeto', rx:/forma|objeto|formato|estrutura/i},
          {rotulo:'que interface aceita ser reaberta/estendida', rx:/reab|estend|extends|declaration merging|merge|redeclar/i}],
  gabarito:'<p><b>A resposta curta:</b> <code>interface</code> descreve a forma de <b>um</b> objeto. <code>type</code> descreve <b>qualquer</b> tipo — inclusive uma uniao, que e o caso do resultado.</p>'+
       '<p>O <code>ResultadoVinculo</code> nao e um objeto so: e <b>um de dois formatos</b>, ligados pelo <code>|</code>. Interface nao escreve isso — ela nao tem como dizer "ou isto, ou aquilo".</p>'+
       '<p>A <code>EntradaVinculo</code> e um objeto so, entao os dois serviriam. Ficou <code>interface</code> por convencao: interface pode ser <b>reaberta</b> depois (voce declara ela de novo e os campos somam), o que e util quando outro arquivo precisa acrescentar campo. <code>type</code> nao permite isso — redeclarar da erro.</p>'+
       '<div class="dica">Se te perguntarem "qual usar?", a resposta honesta e: interface pra forma de objeto, type quando precisa de uniao, tupla, ou apelido de tipo primitivo. Nao e questao de gosto — e do que cada um consegue expressar.</div>'},

 {id:'2', alvo:'o teste do curriculo: Omit',
  html:'<p>Voce tem <code>interface Contrato</code> com 12 campos, incluindo <code>id</code>. Na hora de <b>criar</b> um contrato novo, o <code>id</code> ainda nao existe — quem gera e o banco.</p>'+
       '<p><b>Explica:</b> o que <code>Omit&lt;Contrato, \'id\'&gt;</code> faz, e por que isso e melhor do que escrever uma segunda interface <code>ContratoNovo</code> com os 11 campos na mao?</p>',
  pontos:[{rotulo:'que Omit deriva um tipo a partir de outro, tirando campo(s)', rx:/tir|remov|exclu|sem o|deriv|a partir/i},
          {rotulo:'que a copia manual DESSINCRONIZA quando o original muda', rx:/dessincron|desatualiz|duas vezes|manter|sincron|mud|esquec/i}],
  gabarito:'<p><b>O que faz:</b> <code>Omit&lt;Contrato, \'id\'&gt;</code> produz um tipo novo com todos os campos de <code>Contrato</code> <b>menos</b> o <code>id</code>. E derivado, nao copiado.</p>'+
       '<p><b>Por que e melhor:</b> porque a copia na mao <b>apodrece</b>. No dia em que alguem acrescenta <code>responsavel_juridico</code> ao <code>Contrato</code>, a interface copiada continua com 11 campos e ninguem percebe — o compilador nao tem como saber que as duas deviam andar juntas. Com <code>Omit</code>, o campo novo aparece nos dois no mesmo instante.</p>'+
       '<div class="dica">E a mesma logica do "progresso derivado nunca digitado" do Meus Projetos: dado que da pra derivar nao se copia. Vale pra tipo tambem.</div>'},

 {id:'3', alvo:'o teste do curriculo: uniao literal',
  html:'<p>A etapa do pos-venda so pode ser um destes: <code>aguardando_pagamento</code>, <code>documentos</code>, <code>a_confirmar</code>, <code>concluido</code>.</p>'+
       '<p><b>Explica:</b> qual a diferenca pratica entre tipar esse campo como <code>string</code> e tipar como uniao literal <code>\'aguardando_pagamento\' | \'documentos\' | ...</code>? <b>Que bug o segundo pega que o primeiro deixa passar?</b></p>',
  pontos:[{rotulo:'que string aceita QUALQUER texto, inclusive errado/typo', rx:/qualquer|typo|erro de digit|inv[aá]lid|qualquer coisa|nada impede/i},
          {rotulo:'que a uniao literal fecha o conjunto de valores possiveis', rx:/s[oó] (esses|aceita)|fecha|restring|limit|conjunto|lista de valores/i},
          {rotulo:'que o editor passa a completar e o compilador a acusar', rx:/autocomplet|editor|sugere|compilador acusa|em tempo de compil/i}],
  gabarito:'<p><b>Com <code>string</code></b>, isto compila: <code>etapa = "concluido "</code> (com espaco), <code>"CONCLUIDO"</code>, <code>"concluded"</code>. Nenhum erro. O bug aparece semanas depois, quando a tela filtra por <code>"concluido"</code> e o contrato simplesmente <b>nao aparece em lugar nenhum</b> — nao quebra, some.</p>'+
       '<p><b>Com a uniao literal</b>, o compilador recusa qualquer valor fora da lista, na hora de escrever. E o editor passa a completar os quatro pra voce, entao voce nem digita errado.</p>'+
       '<div class="dica">Esse e o argumento mais forte que voce tem sobre TypeScript numa entrevista, porque e um bug SILENCIOSO — a categoria que mais custa caro.</div>'},

 {id:'4', alvo:'o teste do curriculo: strict',
  html:'<p>O <code>tsconfig.json</code> que subiu hoje tem <code>"strict": true</code>.</p>'+
       '<p><b>Explica:</b> o que muda com ele ligado? Cita <b>pelo menos uma</b> checagem concreta que so existe por causa dele — e diz por que desligar seria ruim num projeto que ja tem 44 telas em producao.</p>',
  pontos:[{rotulo:'que null/undefined param de ser aceitos em qualquer tipo (strictNullChecks)', rx:/null|undefined/i},
          {rotulo:'que parametro sem tipo deixa de virar any calado (noImplicitAny)', rx:/implicit|any|sem tipo|inferi/i},
          {rotulo:'que ligar depois, com codigo grande, custa muito mais', rx:/depois|custa|caro|dificil|come[cç]o|desde o in[ií]cio|legado/i}],
  gabarito:'<p><code>strict</code> e um <b>pacote</b> de checagens. As duas que mais pegam:</p>'+
       '<p><b><code>strictNullChecks</code></b> — sem ele, <code>null</code> e <code>undefined</code> cabem em qualquer tipo, entao <code>const nome: string = null</code> passa e o <code>nome.trim()</code> explode em runtime. Com ele, ou o tipo diz <code>| null</code>, ou nao entra.</p>'+
       '<p><b><code>noImplicitAny</code></b> — sem ele, parametro sem tipo vira <code>any</code> <b>calado</b>, e voce acha que esta tipado quando nao esta. Com ele, o compilador exige que voce diga.</p>'+
       '<p><b>Por que nao desligar:</b> ligar <code>strict</code> depois, num projeto grande, faz aparecerem centenas de erros de uma vez e ninguem tem um dia pra resolver — na pratica fica desligado pra sempre. Comecando ligado, cada arquivo novo ja nasce certo e o custo se dilui.</p>'},

 {id:'5', alvo:'o teste do curriculo: any x unknown',
  html:'<p>Chega um JSON do Kommo e voce nao sabe o formato.</p>'+
       '<pre>const a: any = JSON.parse(corpo);\nconst u: unknown = JSON.parse(corpo);</pre>'+
       '<p><b>Explica:</b> o que acontece se voce escrever <code>a.lead.nome</code> e o que acontece se escrever <code>u.lead.nome</code>? Qual dos dois voce quer numa borda com sistema de fora, e por que?</p>',
  pontos:[{rotulo:'que any desliga a checagem e compila qualquer coisa', rx:/desliga|passa|compila|aceita|nao checa|não checa|sem checagem/i},
          {rotulo:'que unknown obriga a verificar antes de usar', rx:/obrig|verific|checar|estreit|narrow|antes de usar|precisa/i},
          {rotulo:'que unknown e o certo na borda com sistema externo', rx:/borda|externo|fora|entrada|api|json/i}],
  gabarito:'<p><code>a.lead.nome</code> <b>compila</b>. <code>any</code> desliga a checagem: o TypeScript para de olhar. Se o Kommo mudar o formato, voce descobre em producao, com <code>Cannot read properties of undefined</code>.</p>'+
       '<p><code>u.lead.nome</code> <b>nao compila</b>: <i>"Object is of type unknown"</i>. Pra usar, voce e obrigado a verificar antes — <code>typeof</code>, uma checagem de campo, um validador.</p>'+
       '<p><b>Na borda voce quer <code>unknown</code>.</b> Dado que vem de fora e exatamente o que voce nao controla. <code>any</code> ali e mentir pra si mesmo: o tipo diz que esta tudo certo justamente onde voce tem menos garantia.</p>'+
       '<div class="dica">Frase que funciona em entrevista: "<code>any</code> apaga o erro, <code>unknown</code> adia ele pro lugar certo — onde da pra tratar".</div>'},

 {id:'6', alvo:'o teste do curriculo: TypeScript existe em runtime?',
  html:'<p><b>Explica:</b> depois de rodar <code>npm run build:ts</code>, o que sobra dos seus tipos dentro do <code>services/cobranca-vinculo.js</code> que foi pro VPS?</p>'+
       '<p>E a pergunta que vem junto: se os tipos somem, <b>eles servem pra alguma coisa em producao?</b></p>',
  pontos:[{rotulo:'que os tipos sao APAGADOS na compilacao (type erasure)', rx:/apag|somem|some|desaparec|nao existe|não existe|remov|erasure|sai/i},
          {rotulo:'que o que roda no VPS e JavaScript comum', rx:/javascript|js comum|js puro|node so ve|vira js/i},
          {rotulo:'que nao ha validacao em runtime — JSON de fora entra errado do mesmo jeito', rx:/runtime|execu[cç][aã]o|nao valida|não valida|json|entrada|externo/i}],
  gabarito:'<p><b>Nao sobra nada.</b> Os tipos sao apagados na compilacao. Abre o <code>services/cobranca-vinculo.js</code> gerado: as anotacoes sumiram, o que ficou e JavaScript comum. O Node nunca ve um tipo.</p>'+
       '<p><b>E sim, servem</b> — mas <b>antes</b> de rodar, nao durante. Eles pegam o erro no seu editor e no build. Zero custo em producao, e zero protecao em producao.</p>'+
       '<p><b>A consequencia que quase todo mundo esquece:</b> se um JSON do Asaas chegar com formato diferente do que a interface promete, <b>entra do mesmo jeito</b>. O tipo nao valida nada em runtime. Pra isso e preciso checar de verdade no codigo (ou um validador tipo zod).</p>'+
       '<div class="dica">Essa e a pergunta que mais derruba junior em entrevista, porque quem so escreveu TS sem compilar na mao acha que o tipo "protege" a aplicacao rodando.</div>'},

 {id:'7', alvo:'o que voce escreveu hoje: uniao discriminada',
  html:'<pre>export type ResultadoVinculo =\n  | { ok: true;  externalReference: number | null; motivo: string | null }\n  | { ok: false; erro: string };</pre>'+
       '<p><b>Explica:</b> depois de <code>if (r.ok) { ... }</code>, por que dentro do <code>if</code> o compilador deixa ler <code>r.externalReference</code> e <b>recusa</b> ler <code>r.erro</code>?</p>'+
       '<p>E: o que o campo <code>ok</code> tem de especial pra isso funcionar?</p>',
  pontos:[{rotulo:'que o if estreita o tipo (narrowing)', rx:/estreit|narrow|reduz|filtra|elimina|descarta|sabe qual/i},
          {rotulo:'que ok e o discriminante — literal true/false, nao boolean', rx:/discrimin|literal|true|false|marca|etiqueta|campo comum/i},
          {rotulo:'que sem isso o erro so apareceria em runtime', rx:/runtime|execu[cç][aã]o|produ[cç][aã]o|undefined|so depois|só depois/i}],
  gabarito:'<p>O <code>ok</code> e o <b>discriminante</b>: um campo que existe nos dois formatos e tem valor <b>literal</b> diferente em cada um — <code>true</code> num, <code>false</code> no outro. Repare que nao e <code>boolean</code>; se fosse, os dois lados teriam o mesmo tipo e nao daria pra distinguir.</p>'+
       '<p>Quando voce escreve <code>if (r.ok)</code>, o compilador <b>estreita</b> (narrowing): dentro do <code>if</code> so o primeiro formato sobrevive, entao <code>externalReference</code> existe e <code>erro</code> nao. No <code>else</code>, o contrario.</p>'+
       '<p><b>O que isso pega:</b> antes, em JS, <code>r.erro</code> num retorno de sucesso devolvia <code>undefined</code> caladinho — e a tela mostrava vazio em vez de mensagem. Agora e erro de compilacao, na sua maquina, antes do commit.</p>'},

 {id:'8', alvo:'defender uma decisao de projeto (o que entrevista cobra)',
  html:'<p>No <code>contrato-honorarios</code>, o <code>.js</code> gerado pelo TypeScript e <b>commitado no git</b> junto com o <code>.ts</code>. Muita gente acha isso errado — "arquivo gerado nao vai pro repo".</p>'+
       '<p><b>Explica a decisao:</b> por que foi feito assim aqui? Qual o risco que isso cria, e o que foi posto no lugar pra segurar esse risco?</p>',
  pontos:[{rotulo:'que a imagem Docker nao tem typescript (npm ci --omit=dev)', rx:/docker|imagem|omit|dev|producao|não existe|nao existe|devdepend/i},
          {rotulo:'que assim o deploy nao precisou mudar', rx:/deploy|atualizar|dockerfile|nao mud|não mud|intocad|mesma esteira/i},
          {rotulo:'que o risco e o .js ficar defasado do .ts, em silencio', rx:/defasad|dessincron|desatualiz|velho|silenc|esquec/i},
          {rotulo:'que existe teste travando isso (ts-build.test.js)', rx:/teste|test|trava|npm test|recompil|compara/i}],
  gabarito:'<p><b>Por que:</b> o <code>Dockerfile</code> roda <code>npm ci --omit=dev</code> e diz na primeira linha "sem etapa de build". <code>typescript</code> e devDependency, entao <b>nao existe dentro da imagem</b> — se o <code>.js</code> nao fosse versionado, nao haveria quem o gerasse la. Compilando na maquina e commitando, <code>deploy.ps1</code>, <code>atualizar.sh</code> e <code>Dockerfile</code> ficaram <b>intocados</b>.</p>'+
       '<p><b>O risco:</b> alguem edita o <code>.ts</code>, esquece o <code>npm run build:ts</code>, e o VPS passa a rodar o <code>.js</code> antigo — <b>sem erro nenhum</b>, que e o pior jeito de errar.</p>'+
       '<p><b>O que segura:</b> <code>test/ts-build.test.js</code> recompila e compara com o versionado dentro do <code>npm test</code>. Se divergir, quebra e diz o comando pra rodar.</p>'+
       '<div class="dica">Isto e o formato de resposta que entrevista senior quer: decisao, restricao que a causou, risco assumido, e o controle que voce colocou. Nao "e melhor assim".</div>'},

 // ---------------- NODE ----------------
 {id:'N1', alvo:'node: dependencies x devDependencies',
  html:'<p>O <code>Dockerfile</code> do contrato-honorarios roda <code>npm ci --omit=dev</code>. O <code>typescript</code> esta em <code>devDependencies</code>.</p>'+
       '<p><b>Explica:</b> o que <code>--omit=dev</code> faz, e como voce decide se um pacote novo vai em <code>dependencies</code> ou em <code>devDependencies</code>?</p>'+
       '<p>E a pegadinha: o que aconteceria se o <code>express</code> tivesse sido instalado com <code>-D</code> por engano?</p>',
  pontos:[{rotulo:'que --omit=dev nao instala as devDependencies', rx:/nao instal|não instal|pula|fora|exclu|ignora|sem as dev/i},
          {rotulo:'a regra: precisa RODANDO = dependencies; so pra construir/testar = dev', rx:/rodand|runtime|execu|producao|produção|construir|build|test/i},
          {rotulo:'que o app quebraria ao subir (modulo nao encontrado)', rx:/quebr|nao encontr|não encontr|cannot find|erro|nao sobe|não sobe|falha/i}],
  gabarito:'<p><code>--omit=dev</code> instala <b>so</b> o que esta em <code>dependencies</code>. As <code>devDependencies</code> ficam de fora — imagem menor, menos coisa pra dar problema, e nada de ferramenta de desenvolvimento em producao.</p>'+
       '<p><b>A regra pra decidir:</b> se o pacote precisa existir com o app <b>rodando</b>, e <code>dependencies</code>. Se so serve pra construir, testar ou desenvolver, e <code>devDependencies</code>. <code>express</code> e <code>pg</code> rodam. <code>typescript</code> e <code>nodemon</code> nao.</p>'+
       '<p><b>Se o express fosse -D:</b> passaria em tudo na sua maquina (onde <code>npm i</code> instala os dois) e quebraria <b>so no container</b>, com <code>Cannot find module \'express\'</code>. E o tipo de erro que so aparece no deploy — por isso o teste de "roda na minha maquina" nao pega.</p>'},

 {id:'N2', alvo:'node: uma thread so, e mesmo assim atende varios',
  html:'<p>A tela <code>/pontuacao-saude</code> ficou lenta. O motivo: o backend pedia <b>400 paginas do Kommo, uma depois da outra</b>, esperando cada resposta pra pedir a proxima.</p>'+
       '<p><b>Explica:</b> o Node roda seu codigo numa thread so. Entao como ele consegue atender varias pessoas ao mesmo tempo? E, nesse caso das 400 paginas, <b>o servidor ficou travado pra todo mundo ou so aquela tela ficou lenta?</b> Por que?</p>',
  pontos:[{rotulo:'que a espera de rede/IO nao bloqueia — o Node vai fazer outra coisa', rx:/nao bloque|não bloque|libera|enquanto|espera|io|assincron|event loop|fila/i},
          {rotulo:'que so a tela ficou lenta; as outras requisicoes seguiram', rx:/so (a|aquela|essa)|só (a|aquela|essa)|outras (seguem|continuam|funcionam)|nao trava|não trava|apenas/i},
          {rotulo:'que o conserto e pedir em paralelo, nao em serie', rx:/paralelo|ao mesmo tempo|promise\.all|junto|de uma vez/i}],
  gabarito:'<p>A thread e uma so, mas <b>esperar rede nao ocupa a thread</b>. Quando o codigo pede a pagina do Kommo, o Node registra "me avisa quando chegar" e vai atender outra requisicao. E por isso que um servidor Node aguenta muita gente sem uma thread por pessoa.</p>'+
       '<p><b>Nesse caso, so aquela tela ficou lenta.</b> As 400 esperas eram de rede, entao o servidor continuou respondendo o resto normalmente. Somando 400 idas e voltas em serie, a tela levava minutos — mas ninguem mais foi afetado.</p>'+
       '<p><b>O conserto</b> nao e "otimizar a tela": e pedir as paginas <b>em paralelo</b> (em lotes, pra nao estourar o limite da API). 400 esperas em serie viram poucos segundos quando acontecem juntas.</p>'+
       '<div class="dica">O que TRAVARIA todo mundo seria trabalho de CPU: um loop pesado, JSON gigante, criptografia em cima de muita coisa. Isso sim ocupa a thread e ninguem mais e atendido.</div>'},

 {id:'N3', alvo:'node: segredo e process.env',
  html:'<p>Regra da casa no contrato-honorarios: <b>segredo nunca sai em resposta HTTP nem em log</b> — a rota de saude so diz "configurada" ou "faltando", nunca o valor. E o <code>.env</code> esta no <code>.gitignore</code>.</p>'+
       '<p><b>Explica:</b> por que a chave do Asaas vem de <code>process.env</code> em vez de estar escrita no codigo? Cita <b>dois</b> problemas concretos de deixar ela no arquivo.</p>',
  pontos:[{rotulo:'que ela iria pro git e ficaria no historico pra sempre', rx:/git|reposit|hist[oó]ric|commit|p[uú]blic/i},
          {rotulo:'que muda por ambiente (teste x producao) sem mexer no codigo', rx:/ambiente|sandbox|teste|produ[cç][aã]o|trocar|sem mexer|cada/i},
          {rotulo:'que pra trocar a chave bastaria reiniciar, sem novo deploy de codigo', rx:/trocar|rotac|reinici|deploy|sem alterar/i}],
  gabarito:'<p><b>1. O git guarda pra sempre.</b> Chave escrita no codigo vai pro commit — e apagar depois nao resolve, ela continua no historico. Se o repo virar publico um dia, ou alguem clonar, a chave vazou. A unica saida real e revogar a chave.</p>'+
       '<p><b>2. O mesmo codigo precisa rodar em lugares diferentes.</b> Sua maquina e o VPS usam credenciais distintas (e o <code>ZAPSIGN_SANDBOX</code> liga o modo de teste). Com <code>process.env</code>, o codigo e um so e o ambiente decide.</p>'+
       '<p><b>De brinde:</b> vazou a chave? Troca a variavel e reinicia. Nao precisa alterar codigo, revisar PR nem fazer deploy.</p>'+
       '<div class="dica">O detalhe que quase ninguem lembra: <b>log tambem vaza</b>. <code>console.log(config)</code> com o objeto inteiro joga a chave no log, que costuma ser menos protegido que o banco.</div>'},

 {id:'N4', alvo:'node/express: middleware e a ordem',
  html:'<p>No <code>server.js</code> existem <code>helmet</code>, <code>express-rate-limit</code>, o verificador de JWT e as rotas.</p>'+
       '<p><b>Explica:</b> o que e um middleware e o que acontece se ele <b>nao chamar</b> <code>next()</code>. E: por que a ordem em que voce registra importa — o que quebra se o verificador de login for registrado <b>depois</b> das rotas?</p>',
  pontos:[{rotulo:'que middleware roda no meio do caminho, antes da rota', rx:/antes|no meio|caminho|passa|intercept|cada requisi/i},
          {rotulo:'que sem next() a requisicao PARA ali (e pode ficar pendurada)', rx:/para|nao (segue|continua|passa)|não (segue|continua|passa)|trava|pendur|timeout|morre/i},
          {rotulo:'que registrado depois, ele nao protege as rotas de cima', rx:/depois|nao protege|não protege|ja respondeu|já respondeu|passa direto|sem prote|antes dele/i}],
  gabarito:'<p><b>Middleware</b> e uma funcao que roda no caminho entre a requisicao chegar e a rota responder. Ela pode olhar, mudar, barrar — ou passar adiante com <code>next()</code>.</p>'+
       '<p><b>Sem <code>next()</code>:</b> a requisicao para ali. Se o middleware tambem nao responder nada, o cliente fica esperando ate dar timeout — sem erro no log, porque nada quebrou. Foi so esquecido.</p>'+
       '<p><b>Ordem:</b> o Express executa na ordem em que voce registrou. Verificador de login <b>depois</b> das rotas significa que a rota ja respondeu antes de ele rodar — ou seja, <b>rota aberta</b>, sem nenhum erro aparecer. Por isso protecao vai sempre em cima.</p>'},

 // ---------------- JAVASCRIPT ----------------
 {id:'J1', alvo:'js: == x === e o != null de proposito',
  html:'<p>No <code>cobranca-vinculo</code> voce escreveu <code>contratoId == null</code> — com <b>dois</b> iguais, de proposito. Em quase todo o resto do sistema se usa <code>===</code>.</p>'+
       '<p><b>Explica:</b> qual a diferenca entre <code>==</code> e <code>===</code>, e por que <code>== null</code> e a excecao que vale a pena?</p>',
  pontos:[{rotulo:'que == converte tipo antes de comparar e === nao', rx:/convert|coer[cç]|tipo|transform|iguala/i},
          {rotulo:'que x == null pega null E undefined de uma vez', rx:/null e undefined|undefined|os dois|ambos|as duas/i},
          {rotulo:'que === e o padrao porque a conversao surpreende', rx:/padr[aã]o|surpre|previs|estranh|inesperad|armadilha/i}],
  gabarito:'<p><code>===</code> compara valor <b>e</b> tipo. <code>==</code> converte antes, e a conversao produz coisas que ninguem espera: <code>"" == 0</code> e verdadeiro, <code>"0" == 0</code> tambem, <code>null == 0</code> e falso.</p>'+
       '<p><b>A excecao:</b> <code>x == null</code> e verdadeiro <b>exatamente</b> para <code>null</code> e <code>undefined</code>, e falso para todo o resto — inclusive <code>0</code> e <code>""</code>. E o jeito curto de perguntar "veio vazio?" sem escrever <code>x === null || x === undefined</code>.</p>'+
       '<p><b>Por que importa aqui:</b> o campo pode chegar como <code>null</code> do banco ou <code>undefined</code> quando a tela nao mandou. Os dois significam "nao escolheu contrato". Se voce usasse <code>=== null</code>, o <code>undefined</code> escapava e seguia como se fosse um id valido.</p>'+
       '<div class="dica">Regra: <code>===</code> sempre, menos em <code>== null</code>, que e idiomatico e todo backend Node usa.</div>'},

 {id:'J2', alvo:'js: o catch que transformou erro em "nao existe"',
  html:'<p>Bug real da esteira de reunioes, 27/08. O codigo era mais ou menos assim:</p>'+
       '<pre>const processos = await buscarNoAdvbox(numero).catch(() =&gt; null);\nif (!processos) return { processos: [] };</pre>'+
       '<p>Quando o ADVBOX oscilava, a tela aparecia <b>vazia</b> — e o servidor respondia <code>200</code> com lista vazia, sem nenhum erro no log.</p>'+
       '<p><b>Explica:</b> por que esse <code>catch</code> e perigoso? Qual a diferenca entre "deu erro ao buscar" e "buscou e nao achou nada" — e por que o codigo acima confunde as duas?</p>',
  pontos:[{rotulo:'que o catch engole a falha e some com a informacao', rx:/engol|esconde|silenc|apaga|perde|some|mascar/i},
          {rotulo:'que "erro" e "vazio" viram a mesma coisa pra quem chama', rx:/mesma coisa|indistin|confunde|igual|nao da pra saber|não dá pra saber|ambos/i},
          {rotulo:'que o certo e deixar estourar ou responder erro (5xx), nao 200 vazio', rx:/estour|propag|relan|throw|5\d\d|erro de verdade|avisar|nao engolir|não engolir/i}],
  gabarito:'<p>O <code>.catch(() =&gt; null)</code> transforma <b>qualquer</b> falha — rede fora, credencial vencida, ADVBOX de joelhos — em <code>null</code>. E o <code>if</code> logo abaixo trata <code>null</code> como "nao tem processo".</p>'+
       '<p><b>Sao coisas diferentes:</b> "nao achei nada" e uma resposta valida do sistema; "nao consegui perguntar" e uma falha. Quem chama precisa saber qual foi. Aqui as duas viraram lista vazia, e o usuario recebeu <code>200</code> — o codigo de "deu tudo certo".</p>'+
       '<p><b>O estrago:</b> ninguem foi alertado, o log ficou limpo, e o Andre viu tela vazia achando que nao havia dado. Um erro que <b>aparece</b> e barato; esse custou dias porque nao aparecia.</p>'+
       '<div class="dica">Se for pegar o erro, pegue pra <b>fazer alguma coisa</b>: logar, responder 502, tentar de novo. <code>catch</code> que devolve valor neutro e como desligar o alarme de incendio pra parar o barulho.</div>'},

 {id:'J3', alvo:'js: a barra invertida que sumiu da string',
  html:'<p>Bug real dos Casos Sensiveis. Alguem escreveu uma rota com aspas simples:</p>'+
       '<pre>app.get(&#39;/caso/:id(&#92;d+)&#39;, ...)</pre>'+
       '<p>E a rota nunca casava com <code>/caso/42</code>. Dentro da string, o que chegou no Express foi <code>(d+)</code> — a barra invertida <b>sumiu</b>.</p>'+
       '<p><b>Explica:</b> por que ela sumiu? O que <code>&#92;d</code> significa dentro de uma string JS, e como se escreve isso certo?</p>',
  pontos:[{rotulo:'que a barra invertida e escape DENTRO da string e e consumida', rx:/escape|consum|come|interpret|especial|sumi|engol/i},
          {rotulo:'que \\d nao e sequencia conhecida, entao vira so d', rx:/nao (existe|e conhecid|é conhecid)|não (existe|e conhecid|é conhecid)|vira d|so o d|só o d|sobra|desconhec/i},
          {rotulo:'que a solucao e duplicar (\\\\d) ou usar regex de verdade', rx:/duplic|dois|dobr|\\\\\\\\|barra dupla|regex|express[aã]o regular|literal/i}],
  gabarito:'<p>Dentro de uma string, a barra invertida e <b>escape</b>: ela nao e um caractere, e uma instrucao pro que vem depois. <code>&#92;n</code> vira quebra de linha, <code>&#92;t</code> vira tab.</p>'+
       '<p><code>&#92;d</code> nao e escape conhecido — entao o JS simplesmente <b>descarta a barra</b> e sobra <code>d</code>. A string virou <code>/caso/:id(d+)</code>, que casa com <code>/caso/ddd</code>, nao com numero.</p>'+
       '<p><b>Certo:</b> ou duplica a barra (<code>&#39;(&#92;&#92;d+)&#39;</code>), que produz uma barra de verdade na string, ou usa uma expressao regular de verdade em vez de string.</p>'+
       '<div class="dica">Isso e traicoeiro porque <b>nao da erro</b>: a string e valida, a rota registra, o servidor sobe. So nunca casa. O jeito de pegar e imprimir a string e olhar o que ficou.</div>'},

 {id:'J4', alvo:'js: Set nao tem includes',
  html:'<p>Bug real do painel de formularios: a fase 3 subiu com o <b>Dossie morto por 2 dias</b>. A causa foi um <code>Set</code> sendo lido com <code>.includes(...)</code> — a gaveta ficava parada em "Abrindo...", <b>sem erro nenhum na tela</b>.</p>'+
       '<p><b>Explica:</b> por que <code>meuSet.includes(x)</code> nao funciona, qual e o metodo certo, e — a parte que importa — <b>por que isso nao apareceu como erro</b> e sim como tela travada?</p>',
  pontos:[{rotulo:'que Set usa .has(); .includes e de Array', rx:/\.has|has\(|array|lista/i},
          {rotulo:'que chamar metodo inexistente lanca TypeError', rx:/typeerror|nao e uma fun|não é uma fun|is not a function|erro|excec|exceç/i},
          {rotulo:'que o erro foi engolido por um catch/promise sem tratamento', rx:/catch|engol|promise|silenc|nao apareceu|não apareceu|sem tratamento|unhandled/i}],
  gabarito:'<p><code>Set</code> e <code>Array</code> sao coisas diferentes. Array tem <code>.includes()</code>; Set tem <code>.has()</code>. Chamar <code>.includes</code> num Set lanca <code>TypeError: meuSet.includes is not a function</code>.</p>'+
       '<p><b>E aqui esta a licao:</b> o erro <i>aconteceu</i> — so nao chegou na tela. Ele estourou dentro de um trecho assincrono cuja falha ninguem tratava, entao a funcao que preencheria a gaveta morreu no meio e o "Abrindo..." ficou pra sempre. Do lado de fora, parecia lentidao.</p>'+
       '<p><b>Como pegar isso:</b> abrir o console do navegador (o <code>TypeError</code> estava la), e tratar a falha do carregamento pra mostrar "nao consegui carregar" em vez de deixar o estado de carregando pendurado.</p>'+
       '<div class="dica">Padrao que se repete no seu sistema: <b>toda tela travada em "carregando" e um erro que ninguem tratou</b>. Loading eterno nunca e lentidao — e excecao engolida.</div>'},

 // ---------------- BACKEND EM GERAL ----------------
 {id:'B1', alvo:'backend: 400 nao e lista vazia',
  html:'<p>Bug real da pontuacao comercial: o resumo de esforco ficou <b>morto por 22 dias</b> (24 resumos, 370 pontos perdidos). A query citava o id de uma pessoa que saiu, e o Kommo respondeu <b>400</b> — nao uma lista vazia. O codigo tratou como "nao veio nada" e seguiu.</p>'+
       '<p><b>Explica:</b> o que a familia <code>4xx</code> significa contra a <code>5xx</code>, e por que tratar um <code>400</code> como "sem resultado" e um erro perigoso. Como o codigo deveria ter se comportado?</p>',
  pontos:[{rotulo:'que 4xx e culpa do pedido e 5xx e do servidor', rx:/4xx|400|pedido|requisi|cliente|culpa|errad|invalid/i},
          {rotulo:'que 200 com lista vazia e uma resposta valida — 400 nao e', rx:/200|lista vazia|vazio|resposta v[aá]lida|diferente|nao e o mesmo|não é o mesmo/i},
          {rotulo:'que devia falhar alto: log, alerta, ou parar — nao seguir calado', rx:/log|alert|avis|falhar|parar|estour|barulho|nao seguir|não seguir|monitor/i}],
  gabarito:'<p><b><code>4xx</code></b> quer dizer "o seu pedido esta errado" — e o <code>400</code> especificamente: mal formado ou invalido. <b><code>5xx</code></b> quer dizer "o pedido estava ok, eu e que falhei". A diferenca importa porque <code>4xx</code> nao adianta repetir: vai dar errado de novo ate voce corrigir o pedido.</p>'+
       '<p><b>O erro aqui:</b> <code>200</code> com <code>[]</code> significa "perguntei e nao ha nada" — informacao verdadeira. <code>400</code> significa "nem cheguei a perguntar direito". Tratar os dois igual faz o sistema <b>relatar zero com confianca</b>, que e pior que quebrar.</p>'+
       '<p><b>O certo:</b> checar o status. Se nao for 2xx, isso e falha — loga, alerta (o <code>#🐛-auto-falhas</code> existe pra isso) e nao grava resultado. Vinte e dois dias de silencio so foram possiveis porque ninguem distinguiu as duas coisas.</p>'+
       '<div class="dica">A frase pra entrevista: "resposta vazia e um dado; erro e a ausencia de dado. Se o codigo confunde os dois, o painel mente."</div>'},

 {id:'B2', alvo:'backend: webhook chega duas vezes (idempotencia)',
  html:'<p>O Asaas manda <code>PAYMENT_RECEIVED</code> pro seu webhook, e seu codigo gera comissao e marca o 1o pagamento.</p>'+
       '<p><b>Explica:</b> gateways reenviam o mesmo evento quando nao recebem confirmacao — por rede, timeout, ou tentativa automatica. <b>O que acontece se o mesmo <code>PAYMENT_RECEIVED</code> chegar duas vezes?</b> E como se protege disso?</p>',
  pontos:[{rotulo:'que a comissao/baixa seria feita em dobro', rx:/dobr|duas vezes|duplic|repet|de novo|dois/i},
          {rotulo:'que a protecao e guardar o id do evento ou checar antes de gravar', rx:/id do evento|guard|registr|checar antes|ja process|já process|verific|unico|única|unique/i},
          {rotulo:'que a operacao deve ser idempotente — repetir da o mesmo resultado', rx:/idempot|mesmo resultado|nao muda nada|não muda nada|sem efeito/i}],
  gabarito:'<p><b>Sem protecao, tudo acontece de novo:</b> a comissao e lancada duas vezes, o pagamento e contado duas vezes, e o caixa passa a mentir. E dinheiro — e ninguem percebe, porque cada execucao isolada estava "correta".</p>'+
       '<p><b>A protecao e idempotencia:</b> processar o mesmo evento N vezes tem que dar o mesmo resultado que processar uma. Na pratica: guarde o id do evento numa tabela com chave unica e, ao receber, cheque se ja processou; se sim, responda <code>200</code> e nao faca nada.</p>'+
       '<p><b>Por que responder 200 mesmo assim:</b> se voce responder erro pro duplicado, o gateway entende que falhou e reenvia mais ainda.</p>'+
       '<div class="dica">Isso nao e teoria: o "recebimento em dinheiro" da cobranca avulsa duplica o caixa exatamente quando o dinheiro ja estava la. Mesma familia de bug, causa diferente.</div>'},

 {id:'B3', alvo:'backend: a chave que amarra dois sistemas',
  html:'<p>Caso real (contrato #76). A tela criava cobranca no Asaas <b>sem</b> <code>externalReference</code>. Resultado: o webhook caia em <code>ignored: externalReference-nao-numerico</code>, nao gerava comissao, nao marcava o 1o pagamento, a cobranca sumia da ficha do cliente — e o motor seguiu cobrando o valor <b>velho</b> por 19 dias.</p>'+
       '<p><b>Explica:</b> qual o papel de um campo como o <code>externalReference</code> quando dois sistemas conversam? Por que a falta dele produziu <b>tantos</b> sintomas diferentes?</p>',
  pontos:[{rotulo:'que ele liga o registro de la ao registro daqui', rx:/liga|amarr|vincul|refer|aponta|relacion|identifica/i},
          {rotulo:'que sem ele a volta (webhook) nao sabe a quem aplicar', rx:/volta|webhook|retorn|nao sabe|não sabe|qual contrato|a quem|orfa|órfã/i},
          {rotulo:'que varios efeitos vem da MESMA causa — e por isso pareciam bugs separados', rx:/mesma causa|uma causa|raiz|todos|varios sintomas|vários sintomas|cascata/i}],
  gabarito:'<p>Quando voce cria algo num sistema de fora, ele te devolve o <b>id dele</b>. Mas quando ele te procura depois (webhook), precisa dizer a que coisa <b>sua</b> aquilo se refere. O <code>externalReference</code> e esse bilhete: voce escreve o seu id na ida, e ele te devolve na volta.</p>'+
       '<p><b>Sem o bilhete, a volta chega orfa.</b> O evento diz "pagaram R$ 1.000" e nao ha como saber de qual contrato — entao <b>nada</b> a jusante funciona: comissao depende de saber o vendedor, a baixa depende de saber o contrato, a ficha depende de saber o cliente.</p>'+
       '<p><b>Por isso pareciam bugs separados.</b> Quatro sintomas em quatro telas, uma causa so, la no comeco. Quando um dado de ligacao falta na origem, o estrago aparece espalhado e longe.</p>'},

 {id:'B4', alvo:'backend: pool de conexao',
  html:'<p>O app usa <code>pg</code> com um <b>Pool</b>, criado uma vez, e todas as rotas pegam conexao dele.</p>'+
       '<p><b>Explica:</b> por que nao abrir uma conexao nova a cada requisicao e fechar no fim? Parece mais simples e mais limpo — qual o problema?</p>',
  pontos:[{rotulo:'que abrir conexao e caro (handshake, autenticacao)', rx:/car|lent|custa|demor|handshake|autentic|tempo/i},
          {rotulo:'que o banco tem limite de conexoes simultaneas', rx:/limite|m[aá]ximo|esgot|acaba|too many|quota|neon/i},
          {rotulo:'que o pool reaproveita conexoes ja abertas e enfileira o excesso', rx:/reaproveit|reus|reutiliz|prontas|fila|empresta|devolve/i}],
  gabarito:'<p><b>Abrir conexao e caro.</b> Tem handshake de rede, TLS e autenticacao — dezenas de milissegundos por vez. Numa tela que faz 5 consultas, isso vira o custo dominante.</p>'+
       '<p><b>E o banco tem teto.</b> O Postgres aceita um numero limitado de conexoes simultaneas (no Neon, dependendo do plano, bem pouco). Com uma conexao por requisicao e 30 pessoas usando, voce estoura o limite e o banco recusa — o app cai inteiro, nao so a tela lenta.</p>'+
       '<p><b>O pool</b> mantem um punhado de conexoes abertas e empresta. Quem termina, devolve. Se todas estao ocupadas, a proxima <b>espera na fila</b> em vez de abrir mais uma — e isso protege o banco de voce.</p>'+
       '<div class="dica">O bug classico e pegar do pool e esquecer de devolver (<code>client.release()</code>). Nao quebra na hora: vaza uma conexao por vez, ate o pool secar e tudo travar horas depois.</div>'},

 {id:'B5', alvo:'backend: limite de API e o custo de pedir em serie',
  html:'<p>Dois fatos do seu sistema: o ADVBOX aceita <b>500 POST por dia</b>, e a <code>/pontuacao-saude</code> pedia <b>400 paginas do Kommo em serie</b>.</p>'+
       '<p><b>Explica:</b> o que e rate limit e por que APIs impoem isso. E a parte dificil: se pedir em serie e lento, <b>por que nao disparar as 400 de uma vez?</b> Qual o meio-termo?</p>',
  pontos:[{rotulo:'que o limite protege o servidor dos outros de um cliente abusivo', rx:/proteg|abus|sobrecarr|justo|todos|estabil|derrub/i},
          {rotulo:'que disparar tudo de uma vez leva 429 / bloqueio', rx:/429|bloque|banid|recus|barra|too many|corta/i},
          {rotulo:'que o meio-termo e lotes com concorrencia limitada', rx:/lote|batch|concorr|limitad|aos poucos|de x em x|fila|pool/i},
          {rotulo:'que erro por limite deve esperar e tentar de novo (backoff)', rx:/backoff|esper|tentar de novo|retry|nova tentativa|aguard/i}],
  gabarito:'<p><b>Rate limit</b> e o teto de chamadas num intervalo. Existe porque a API e compartilhada: sem teto, um cliente em loop derruba o servico pra todo mundo. E tambem controla custo — cada chamada custa dinheiro pra quem serve.</p>'+
       '<p><b>Por que nao disparar 400 juntas:</b> voce bate no teto quase imediatamente e passa a receber <code>429 Too Many Requests</code>. Na melhor hipotese perde as respostas; na pior, a chave e bloqueada temporariamente e voce fica sem <b>nada</b> — pior que a lentidao original.</p>'+
       '<p><b>O meio-termo e concorrencia limitada:</b> em vez de 1 por vez ou 400 de uma vez, mande <b>lotes</b> (5, 10) e so comece o proximo quando o anterior terminar. As 400 paginas caem de minutos pra segundos e voce nunca chega perto do teto.</p>'+
       '<p><b>E trate o 429 quando vier:</b> esperar e tentar de novo, dobrando a espera a cada falha (backoff). Repetir na hora so piora.</p>'+
       '<div class="dica">Os "500 POST/dia" do ADVBOX sao um limite <b>diario</b>, nao por segundo — ali o problema nao e velocidade, e orcamento: um job que gasta 500 chamadas de manha deixa o resto do dia sem nenhuma.</div>'},

 // ---------------- ENTREVISTA: o feijao com arroz ----------------
 // Estas caem em quase toda entrevista de junior. Sao "basicas" no sentido de comuns,
 // nao de faceis: quase todo mundo sabe responder pela metade, e a metade que falta e
 // sempre a mesma. O gabarito marca onde costuma faltar.
 {id:'E1', alvo:'entrevista: var, let e const',
  html:'<p>A pergunta mais feita de todas.</p>'+
       '<p><b>Explica:</b> a diferenca entre <code>var</code>, <code>let</code> e <code>const</code>.</p>'+
       '<p>E a de desempate, que derruba a maioria: <b><code>const</code> significa que o valor nao pode mudar?</b> O que acontece com <code>const lista = []</code> se voce fizer <code>lista.push(1)</code>?</p>',
  pontos:[{rotulo:'que var e de funcao e let/const sao de bloco', rx:/bloco|escopo|fun[cç][aã]o|chave|\{/i},
          {rotulo:'que const impede REATRIBUIR, nao alterar o conteudo', rx:/reatribu|trocar|apontar|refer[eê]ncia|conte[uú]do|dentro|mutar|alterar/i},
          {rotulo:'que o push funciona normalmente', rx:/funciona|permite|deixa|push (funciona|vale)|sem erro|pode/i}],
  gabarito:'<p><b>Escopo:</b> <code>var</code> vive na <b>funcao</b> inteira — declarado dentro de um <code>if</code>, existe fora dele. <code>let</code> e <code>const</code> vivem no <b>bloco</b> (entre as chaves), que e o comportamento que todo mundo espera.</p>'+
       '<p><b>E a parte que derruba:</b> <code>const</code> impede <b>reatribuir</b>, nao alterar. <code>lista.push(1)</code> <b>funciona</b> — voce nao trocou a lista, so mexeu dentro dela. O que da erro e <code>lista = []</code>.</p>'+
       '<p>Ou seja: <code>const</code> tranca a <b>caixa a que o nome aponta</b>, nao o que esta dentro da caixa.</p>'+
       '<div class="dica">Resposta pratica que soa bem: "uso <code>const</code> por padrao, <code>let</code> quando preciso reatribuir, e <code>var</code> nunca — mas <code>const</code> nao me da imutabilidade, so estabilidade do nome."</div>'},

 {id:'E2', alvo:'entrevista: null x undefined',
  html:'<p><b>Explica:</b> qual a diferenca entre <code>null</code> e <code>undefined</code>? Quando cada um aparece na pratica?</p>'+
       '<p>E: por que <code>typeof null</code> devolve <code>"object"</code>?</p>',
  pontos:[{rotulo:'que undefined e a ausencia nao intencional (ninguem pos valor)', rx:/nao (foi|definid|atribu)|não (foi|definid|atribu)|ausenc|nunca recebeu|nao existe|não existe|padr[aã]o/i},
          {rotulo:'que null e o vazio INTENCIONAL, colocado por alguem', rx:/intencion|de prop[oó]sito|explic|proposital|alguem (pos|colocou)|alguém|deliberad|banco/i},
          {rotulo:'que typeof null e "object" e e um bug historico da linguagem', rx:/bug|hist[oó]ric|erro antigo|legado|compatibilidade|desde o come/i}],
  gabarito:'<p><b><code>undefined</code></b> e a ausencia que aconteceu sozinha: variavel declarada e nao atribuida, campo que nao existe no objeto, parametro que ninguem passou, funcao que nao retorna nada.</p>'+
       '<p><b><code>null</code></b> e a ausencia que <b>alguem escolheu</b>: "este campo esta vazio de proposito". No seu sistema, quase todo <code>null</code> vem do <b>banco</b> — coluna existente sem valor. Ja o <code>undefined</code> costuma vir do <b>JavaScript</b>, quando algo nao chegou.</p>'+
       '<p><b><code>typeof null === "object"</code> e um bug</b> da primeira versao do JavaScript, de 1995. Nunca foi corrigido porque quebraria codigo no mundo inteiro. Nao ha logica ali pra entender — e so decorar e saber que e defeito.</p>'+
       '<div class="dica">Por isso <code>x == null</code> (dois iguais) e util: pega os dois de uma vez. Ver a questao J1.</div>'},

 {id:'E3', alvo:'entrevista: callback, Promise e async/await',
  html:'<p><b>Explica:</b> a diferenca entre callback, Promise e <code>async/await</code> — e por que a linguagem foi mudando de um pro outro.</p>'+
       '<p>E as duas de desempate: <b>o que exatamente o <code>await</code> faz?</b> E o que acontece se voce <b>esquecer</b> o <code>await</code> numa funcao que grava no banco?</p>',
  pontos:[{rotulo:'que callback aninhado vira escada ("callback hell")', rx:/callback hell|aninh|escada|pir[aâ]mide|indenta|ilegiv|bagun/i},
          {rotulo:'que await pausa AQUELA funcao e espera a Promise resolver', rx:/espera|pausa|aguarda|resolv|para ate|só continua|so continua/i},
          {rotulo:'que sem await voce segue com a Promise, nao com o valor', rx:/promise|nao (espera|é o valor|e o valor)|não espera|objeto|pending|segue/i},
          {rotulo:'que o erro fica sem tratamento e some (unhandled rejection)', rx:/unhandled|sem tratamento|nao pega|não pega|erro some|silenc|engol|escapa/i}],
  gabarito:'<p><b>Callback:</b> voce passa uma funcao pra ser chamada depois. Funciona, mas encadear tres coisas vira escada — e tratar erro exige checar <code>if (err)</code> em cada nivel.</p>'+
       '<p><b>Promise:</b> um objeto que representa "vai ter um valor depois". Da pra encadear com <code>.then()</code> e ter <b>um</b> <code>.catch()</code> pro conjunto.</p>'+
       '<p><b><code>async/await</code>:</b> a mesma Promise, escrita como se fosse sequencial. Da pra usar <code>try/catch</code> normal.</p>'+
       '<p><b>O que o <code>await</code> faz:</b> pausa <b>aquela funcao</b> ate a Promise resolver, e entrega o valor de dentro dela. Repare: pausa a funcao, <b>nao o servidor</b> — o Node segue atendendo os outros (ver N2).</p>'+
       '<p><b>Esquecendo o <code>await</code> num gravar no banco:</b> a funcao segue na hora, sem esperar. Voce responde "salvo" antes de ter salvo. Se a gravacao falhar, o erro estoura <b>fora</b> de qualquer <code>try/catch</code> seu, como unhandled rejection — ninguem trata e ninguem fica sabendo.</p>'+
       '<div class="dica">Este e o modo de falha mais comum de junior em Node, e o mais caro: o sistema diz que salvou, e nao salvou.</div>'},

 {id:'E4', alvo:'entrevista: os verbos do HTTP e REST',
  html:'<p><b>Explica:</b> para que servem <code>GET</code>, <code>POST</code>, <code>PUT</code>, <code>PATCH</code> e <code>DELETE</code>.</p>'+
       '<p>E a que separa quem decorou de quem entendeu: <b>quais desses da pra repetir sem medo</b> — chamar dez vezes e ficar igual a chamar uma? Por que o <code>POST</code> nao esta nessa lista?</p>',
  pontos:[{rotulo:'GET le, POST cria, PUT substitui, PATCH altera parte, DELETE apaga', rx:/get|post|put|patch|delete/i},
          {rotulo:'que GET/PUT/DELETE sao repetiveis (idempotentes) e POST nao', rx:/idempot|repet|mesma coisa|sem medo|de novo|varias vezes|várias vezes/i},
          {rotulo:'que repetir POST cria outro registro', rx:/cria (outro|de novo|dois)|duplic|dobr|novo registro|mais um/i}],
  gabarito:'<p><code>GET</code> le (e nao deve mudar nada). <code>POST</code> cria. <code>PUT</code> substitui o recurso inteiro. <code>PATCH</code> altera parte. <code>DELETE</code> apaga.</p>'+
       '<p><b>Repetiveis (idempotentes):</b> <code>GET</code>, <code>PUT</code> e <code>DELETE</code>. Ler dez vezes da o mesmo resultado; substituir pelo mesmo conteudo dez vezes deixa igual; apagar dez vezes — no fim, apagado.</p>'+
       '<p><b><code>POST</code> nao e</b>, porque criar de novo cria <b>outro</b>. Dois POSTs iguais = duas cobrancas. E por isso que duplo clique em botao de salvar e um problema de verdade, e por que webhook precisa de protecao (ver B2).</p>'+
       '<div class="dica">Amarrar assim mostra que voce entendeu: "idempotencia nao e curiosidade de prova — e o que decide se posso repetir com seguranca quando a rede falha".</div>'},

 {id:'E5', alvo:'entrevista: CORS (o erro que so acontece no navegador)',
  html:'<p>Cenario classico: sua chamada funciona no Postman, e no navegador aparece <i>"blocked by CORS policy"</i>.</p>'+
       '<p><b>Explica:</b> o que e CORS, <b>quem</b> esta bloqueando (o navegador ou o servidor?), e por que existe. Como se resolve — e por que <code>*</code> pra tudo nao e uma boa ideia?</p>',
  pontos:[{rotulo:'que quem bloqueia e o NAVEGADOR, nao o servidor', rx:/navegador|browser|cliente|front|nao e o servidor|não é o servidor/i},
          {rotulo:'que a origem do site e diferente da origem da API', rx:/origem|origin|dom[ií]nio|porta|outro site|cross/i},
          {rotulo:'que o servidor precisa autorizar por cabecalho', rx:/cabe[cç]alho|header|access-control|allow|autoriz|permit|responder/i},
          {rotulo:'que * libera pra qualquer site e vaza se houver credencial', rx:/qualquer site|qualquer origem|todo mundo|inseguro|risco|credencial|cookie/i}],
  gabarito:'<p><b>Quem bloqueia e o navegador.</b> O servidor respondeu normalmente — o navegador e que recusou entregar a resposta ao seu JavaScript. Por isso o Postman passa: ele nao e navegador e nao aplica essa regra.</p>'+
       '<p><b>Por que existe:</b> sem CORS, qualquer site aberto numa aba poderia chamar a API do seu banco <b>usando os cookies que voce ja tem</b> e ler a resposta. A regra padrao e "site so le de si mesmo", e origem diferente e qualquer mudanca de protocolo, dominio <b>ou porta</b>.</p>'+
       '<p><b>Como resolve:</b> o servidor responde cabecalhos dizendo quem pode (<code>Access-Control-Allow-Origin</code>). Ou seja: resolve-se <b>no backend</b>, nao no front.</p>'+
       '<p><b>Por que nao <code>*</code>:</b> libera qualquer site do mundo. Numa API publica de leitura, tudo bem; numa API com login, e furo — e o navegador nem deixa combinar <code>*</code> com credenciais. Liste as origens que voce conhece.</p>'},

 {id:'E6', alvo:'entrevista: INNER JOIN x LEFT JOIN',
  html:'<p>Voce quer listar <b>todos</b> os contratos e, junto, a ultima cobranca de cada um — sabendo que alguns contratos <b>ainda nao tem</b> cobranca nenhuma.</p>'+
       '<p><b>Explica:</b> a diferenca entre <code>INNER JOIN</code> e <code>LEFT JOIN</code>, qual dos dois resolve esse caso, e <b>o que aparece</b> nas colunas da cobranca para um contrato que nao tem nenhuma.</p>',
  pontos:[{rotulo:'que INNER so traz quem tem par dos dois lados', rx:/inner|so (os que|quem)|só (os que|quem)|ambos|nos dois|par|correspond/i},
          {rotulo:'que LEFT traz tudo da esquerda mesmo sem par', rx:/left|esquerda|todos|mesmo sem|independente|todo/i},
          {rotulo:'que as colunas do lado vazio vem NULL', rx:/null|vazi|nulo|nada|em branco/i}],
  gabarito:'<p><b><code>INNER JOIN</code></b> devolve so as linhas que tem correspondencia <b>dos dois lados</b>. Contrato sem cobranca simplesmente <b>nao aparece</b>.</p>'+
       '<p><b><code>LEFT JOIN</code></b> devolve tudo da tabela da esquerda, tendo par ou nao. E o que resolve o caso.</p>'+
       '<p><b>O que aparece:</b> para o contrato sem cobranca, as colunas vindas da cobranca vem <code>NULL</code>. Isso importa porque <code>COUNT(c.id)</code> conta 0 (ignora NULL) enquanto <code>COUNT(*)</code> conta 1 — e e assim que relatorio passa a mentir.</p>'+
       '<div class="dica">O bug classico: usar INNER e o numero vir menor sem ninguem notar, porque quem nao tem par sumiu <b>caladinho</b>. Mesma familia dos bugs silenciosos do seu sistema.</div>'},

 {id:'E7', alvo:'entrevista: por que a consulta ficou lenta (indice)',
  html:'<p>A tabela de contratos cresceu e <code>WHERE cpf = \'...\'</code> ficou lento.</p>'+
       '<p><b>Explica:</b> o que o banco faz quando <b>nao</b> ha indice nessa coluna, o que muda quando voce cria um, e — a pergunta de desempate — <b>por que nao criar indice em toda coluna, entao?</b></p>',
  pontos:[{rotulo:'que sem indice ele varre a tabela inteira (full scan)', rx:/varr|scan|linha por linha|tudo|inteira|percorr|uma a uma/i},
          {rotulo:'que o indice e uma estrutura ordenada que acha sem varrer', rx:/ordenad|[ií]ndice remissivo|busca (bin|direta)|arvore|árvore|b-tree|atalho|direto/i},
          {rotulo:'que indice custa escrita e espaco', rx:/escrit|insert|update|lent(o|a) pra (gravar|escrever)|espa[cç]o|disco|custo|manter/i}],
  gabarito:'<p><b>Sem indice</b>, o banco faz <i>full scan</i>: le linha por linha ate achar. Com 100 linhas ninguem sente; com 100 mil, sente muito.</p>'+
       '<p><b>Com indice</b>, existe uma estrutura ordenada a parte (tipicamente uma arvore B) que leva direto ao lugar — como o indice remissivo de um livro. Deixa de ser "ler tudo" e passa a ser "pular direto".</p>'+
       '<p><b>Por que nao indexar tudo:</b> indice nao e de graca. Cada <code>INSERT</code> ou <code>UPDATE</code> precisa atualizar <b>todos</b> os indices da tabela — entao voce troca leitura rapida por escrita mais lenta, e ainda gasta disco. Indice em coluna que ninguem filtra e so custo.</p>'+
       '<div class="dica">Se te perguntarem como decidir: "<code>EXPLAIN</code> na consulta lenta. Se aparecer Seq Scan numa tabela grande com filtro, ali cabe indice."</div>'},

 {id:'E8', alvo:'entrevista: autenticacao x autorizacao',
  html:'<p>No app do escritorio tem login com senha (bcrypt), segundo fator (TOTP) e um JWT que acompanha as requisicoes. E tem gente que ve <code>/juridico</code> e gente que nao ve.</p>'+
       '<p><b>Explica:</b> a diferenca entre <b>autenticacao</b> e <b>autorizacao</b>, e onde cada uma dessas pecas entra.</p>'+
       '<p>E: por que a senha e guardada com <code>bcrypt</code> em vez de criptografada de um jeito que da pra desfazer?</p>',
  pontos:[{rotulo:'que autenticacao e QUEM voce e', rx:/quem (voce|vc|e|é)|identidade|provar que|login|identific/i},
          {rotulo:'que autorizacao e O QUE voce pode', rx:/o que (voce|vc|pode)|permiss[aã]o|acesso|papel|perfil|pode fazer|direito/i},
          {rotulo:'que hash e de mao unica — nao da pra voltar pra senha', rx:/m[aã]o [uú]nica|nao (da|tem como) (pra )?volt|não (dá|tem como)|irrevers|nao descriptograf|não descriptograf|compara/i},
          {rotulo:'que se vazar o banco, a senha nao esta la em texto', rx:/vaz|banco|roub|texto (puro|claro)|invas|nao ve a senha|não vê a senha/i}],
  gabarito:'<p><b>Autenticacao = quem voce e.</b> Senha e TOTP provam identidade. O JWT e o cracha emitido depois disso, pra voce nao repetir a prova a cada requisicao.</p>'+
       '<p><b>Autorizacao = o que voce pode.</b> Estar logado nao da direito a <code>/juridico</code>; quem decide isso e o papel do usuario, checado a cada requisicao. Sao perguntas <b>separadas</b> — e o erro comum e verificar so a primeira e achar que cobriu a segunda.</p>'+
       '<p><b>Por que hash e nao criptografia:</b> criptografia e de mao dupla — com a chave, volta a senha. Hash e de mao unica: guarda-se o resultado, e no login voce refaz o hash do que a pessoa digitou e <b>compara os dois</b>. A senha original nunca e recuperada, nem por voce.</p>'+
       '<p><b>Por que importa:</b> se o banco vazar, ninguem le as senhas — e como as pessoas repetem senha em outros servicos, isso protege gente muito alem do seu sistema. O <code>bcrypt</code> ainda e <b>de proposito lento</b>, o que torna caro tentar milhoes de senhas.</p>'+
       '<div class="dica">Frase curta que fecha bem: "autenticacao e a portaria, autorizacao e a chave de cada sala".</div>'},
],

};
