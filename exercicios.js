// Biblioteca de exercicios. Duas trilhas.
//
// TS  : cada exercicio monta um arquivo .ts completo e o COMPILADOR julga. Zero diagnostico = acertou.
//       Cada contexto carrega uma PROVA (ex: um `: null` la embaixo) que fecha a porta pra resposta pela metade.
// JS  : cada exercicio monta uma funcao e RODA com entradas conhecidas. Todos os testes passando = acertou.
//
// Os enunciados saem do sistema real dele (services/posvenda-etapa.js), nunca de tutorial.

var EXERCICIOS = {

ts: [
 {id:'1', alvo:'forma nova: | null e number',
  html:'<p><b>Cenario:</b> ja existe esta linha, que compara o campo com nada:</p>'+
       '<pre>contato_advbox: (c: Contrato) =&gt; c.advbox_customer_id != null</pre>'+
       '<p><b>Escreve:</b> a linha que declara esse campo dentro da <code>interface Contrato</code>. Ele e um numero, e pode nao ter valor nenhum.</p>'+
       '<div class="dica">numero e <code>number</code>. "ou nada" se escreve <code>| null</code>, com a barra em pe.</div>',
  contexto:function(r){return 'interface Contrato {\n  primeiro_pagamento_recebido: boolean;\n  '+r+'\n}\n'+
       'const usa = (c: Contrato) => c.advbox_customer_id != null;\n'+
       'const prova: Contrato = { primeiro_pagamento_recebido: true, advbox_customer_id: null };';}},

 {id:'2', alvo:'a mesma forma, segunda vez',
  html:'<p><b>Cenario:</b></p><pre>processo_advbox: (c: Contrato) =&gt; c.advbox_lawsuit_id != null</pre>'+
       '<p><b>Escreve:</b> a linha desse campo dentro da interface.</p>',
  contexto:function(r){return 'interface Contrato {\n  '+r+'\n}\n'+
       'const usa = (c: Contrato) => c.advbox_lawsuit_id != null;\n'+
       'const prova: Contrato = { advbox_lawsuit_id: null };';}},

 {id:'3', alvo:'a mesma forma, base diferente',
  html:'<p><b>Cenario:</b></p><pre>enviado_juridico: (c: Contrato) =&gt; !!c.responsavel_juridico</pre>'+
       '<p><b>Escreve:</b> a linha desse campo. Ele guarda o <b>nome</b> de quem e responsavel, e pode estar vazio.</p>'+
       '<div class="dica">texto e <code>string</code>.</div>',
  contexto:function(r){return 'interface Contrato {\n  '+r+'\n}\n'+
       'const usa = (c: Contrato) => !!c.responsavel_juridico;\n'+
       'const p1: Contrato = { responsavel_juridico: null };\n'+
       'const p2: Contrato = { responsavel_juridico: "Glecio" };';}},

 {id:'4', alvo:'forma nova: tipo de RETORNO',
  html:'<p><b>Cenario:</b> o compilador reclama do <code>contrato</code>:</p>'+
       '<pre>function checklistCompleto(contrato) {\n  return ONBOARDING_ITENS.every(item =&gt; itemResolvido(contrato, item));\n}</pre>'+
       '<p><b>Escreve:</b> so a primeira linha, dizendo o que o <code>contrato</code> e <b>e</b> o que a funcao devolve. Ela devolve um sim/nao.</p>'+
       '<div class="dica">o tipo do retorno vai <b>depois do fecha-parenteses</b>, antes da chave.</div>',
  contexto:function(r){return 'interface Contrato { primeiro_pagamento_recebido: boolean; }\n'+
       'const ONBOARDING_ITENS: string[] = [];\n'+
       'function itemResolvido(c: Contrato, item: string): boolean { return true; }\n'+
       r+'\n  return ONBOARDING_ITENS.every(item => itemResolvido(contrato, item));\n}\n'+
       'const prova: boolean = checklistCompleto({ primeiro_pagamento_recebido: true });';}},

 {id:'5', alvo:'repeticao do 4',
  html:'<p><b>Cenario:</b></p><pre>function derivarEtapaPosVenda(contrato) {</pre>'+
       '<p><b>Escreve:</b> essa linha dizendo so o que o <code>contrato</code> e. Deixa o retorno de fora, ele e o exercicio 6.</p>',
  contexto:function(r){return 'interface Contrato { primeiro_pagamento_recebido: boolean; }\n'+
       r+'\n  return { etapa: "concluido", motivo: null };\n}\n'+
       'const prova = derivarEtapaPosVenda({ primeiro_pagamento_recebido: true });';}},

 {id:'6', alvo:'forma nova: objeto como tipo de retorno',
  html:'<p><b>Cenario:</b> essa funcao sempre devolve um objeto com dois campos, e o <code>motivo</code> as vezes e nada:</p>'+
       '<pre>return { etapa: "concluido", motivo: "manual" };\nreturn { etapa: "a_confirmar", motivo: null };</pre>'+
       '<p><b>Escreve:</b> a mesma linha do 5, agora com o tipo de retorno tambem.</p>'+
       '<div class="dica">a forma de um objeto se escreve entre chaves, igual a uma interface, mas ali mesmo na linha: <code>{ campo: tipo; outro: tipo }</code></div>',
  contexto:function(r){return 'interface Contrato { primeiro_pagamento_recebido: boolean; }\n'+
       r+'\n  if (contrato.primeiro_pagamento_recebido) return { etapa: "concluido", motivo: "manual" };\n'+
       '  return { etapa: "comigo", motivo: null };\n}\n'+
       'const p = derivarEtapaPosVenda({ primeiro_pagamento_recebido: true });\n'+
       'const e: string = p.etapa;\nconst m: string | null = p.motivo;';}},

 {id:'7', alvo:'a dificil: chave que voce nao sabe qual e',
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
],

};
