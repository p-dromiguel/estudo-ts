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

};
