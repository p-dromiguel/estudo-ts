// Motor da pagina. Duas regras de projeto que nao mudam:
//   1. So corrige DEPOIS de submeter. Correcao ao vivo deixa acertar por tentativa e erro.
//   2. Toda tentativa e gravada, inclusive (e principalmente) as erradas. E delas que sai a curva.

var trilha = 'ts', atual = 0, lib = null, pronto = false, tsOk = false, focoEm = null;
function $(id){ return document.getElementById(id); }
function lista(){ return EXERCICIOS[trilha]; }

/* ---------- guarda local ---------- */
function ler(ch, padrao){ try { return JSON.parse(localStorage.getItem(ch)) || padrao; } catch(e){ return padrao; } }
function grava(ch, v){ try { localStorage.setItem(ch, JSON.stringify(v)); } catch(e){} }
function historico(){ return ler('estudo-hist', []); }
function feitos(){ return ler('estudo-feitos', []); }
function rascunho(t, id){ try { return localStorage.getItem('estudo-rasc-' + t + '-' + id) || ''; } catch(e){ return ''; } }
function salvaRascunho(t, id, v){ try { localStorage.setItem('estudo-rasc-' + t + '-' + id, v); } catch(e){} }

/* ---------- corretor TypeScript: o compilador de verdade ---------- */
function checarTS(codigo){
  var nome = 'estudo.ts', libNome = 'lib.d.ts', sfs = {};
  sfs[nome] = ts.createSourceFile(nome, codigo, ts.ScriptTarget.ES2020, true);
  sfs[libNome] = ts.createSourceFile(libNome, lib, ts.ScriptTarget.ES2020, true);
  var host = {
    getSourceFile: function(n){ return sfs[n]; },
    getDefaultLibFileName: function(){ return libNome; },
    writeFile: function(){}, getCurrentDirectory: function(){ return ''; },
    getDirectories: function(){ return []; },
    fileExists: function(n){ return !!sfs[n]; },
    readFile: function(n){ return n === nome ? codigo : lib; },
    getCanonicalFileName: function(n){ return n; },
    useCaseSensitiveFileNames: function(){ return true; },
    getNewLine: function(){ return '\n'; }
  };
  var prog = ts.createProgram([nome], { strict:true, noEmit:true, target: ts.ScriptTarget.ES2020 }, host);
  return ts.getPreEmitDiagnostics(prog)
    .filter(function(d){ return !d.file || d.file.fileName === nome; })
    .map(function(d){ return 'TS' + d.code + ': ' + ts.flattenDiagnosticMessageText(d.messageText, '\n'); });
}

/* ---------- corretor JavaScript: roda de verdade com entradas conhecidas ---------- */
function igual(a, b){
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a && b && typeof a === 'object') { try { return JSON.stringify(a) === JSON.stringify(b); } catch(e){ return false; } }
  return false;
}
function mostrar(v){ try { return v === undefined ? 'undefined' : JSON.stringify(v); } catch(e){ return String(v); } }

/* Descobre o que o andaime espera da resposta, olhando onde ele coloca o `return`.
   Ha dois formatos no arquivo de exercicios:
     function f(x){ RESPOSTA return null; }   -> a resposta PRECISA retornar
     function f(x){ return (RESPOSTA); }      -> a resposta e' expressao, sem return
   Sem essa distincao nao da pra dizer "sua linha nao devolve nada" sem errar no
   segundo caso. */
function papelDaResposta(ex){
  var m;
  try { m = ex.montar('@@@'); } catch (e) { return 'indefinido'; }
  var p = m.indexOf('@@@');
  if (p < 0) return 'indefinido';
  var antes = m.slice(0, p), depois = m.slice(p + 3);
  if (/\breturn\s*\(?\s*$/.test(antes)) return 'expressao';
  if (/\breturn\b/.test(depois)) return 'precisa-retornar';
  return 'indefinido';
}

/* As dicas que faltavam. Isto nao e enfeite: o historico de 02/09 mostra 13
   tentativas no js/6 em que a logica ja estava certa e a unica coisa errada era
   a resposta nao retornar nada — e a mensagem dizia so "esperava X, veio null",
   igualzinho ao que diria se a logica estivesse errada. O corretor mandou pro
   buraco errado. Cada regra abaixo saiu de uma tentativa real. */
function dicasDeSintaxe(resposta, msg){
  var t = resposta.trim(), fora = [];

  // `[etapa: 'x']` — abriu array e escreveu campos de objeto (tentativas 1 e 2)
  if (/Unexpected token ':'/.test(msg) && /\[[^\]]*:/.test(t)) {
    fora.push('voce abriu com [ e escreveu campos com : — [ ] e LISTA. Objeto com campos nomeados usa { }.');
  }
  // parenteses desbalanceados (tentativas 3 e 4: sobrou o ) do if apagado)
  var abre = (t.match(/\(/g) || []).length, fecha = (t.match(/\)/g) || []).length;
  if (abre !== fecha) {
    fora.push('parenteses desbalanceados: ' + abre + ' abrindo e ' + fecha + ' fechando.'
      + (fecha > abre ? ' sobrou um ) — se voce apagou um `if (`, o ) dele ficou.' : ''));
  }
  // valor sem quotes: `motivo: manual` (o compilador diz "not defined" ou reclama do token)
  var semQuote = t.match(/:\s*([a-z_][a-z0-9_]*)\s*[,}\]]/i);
  if (semQuote && !/^(true|false|null|undefined|cm|contrato|item|c)$/i.test(semQuote[1])
      && (/is not defined/.test(msg) || /Unexpected token/.test(msg))) {
    fora.push('`' + semQuote[1] + '` esta sem quotes. Texto precisa de \'aspas\'; sem elas o JS procura uma variavel com esse nome.');
  }
  return fora;
}

function checarJS(ex, resposta){
  var fonte = ex.montar(resposta), f;
  try { f = new Function(fonte + '\nreturn f;')(); }
  catch (e) {
    var msg = e && e.message ? e.message : String(e);
    var lista = ['nao compilou: ' + msg];
    // O interpretador reclama do lugar errado quando falta o ; no fim: a linha do
    // aluno gruda na proxima. Traduz isso pra portugues antes de mostrar.
    var t = resposta.trim();
    if (/Unexpected token/.test(msg) && t && !/[;}]$/.test(t)) {
      lista.push('provavelmente falta o ; no fim da sua linha. sem ele, ela gruda na linha seguinte e o erro aparece no lugar errado.');
    }
    if (/require a function name/.test(msg) && /^function\s*\(/.test(t)) {
      lista.push('voce escreveu uma funcao. este exercicio pede UMA linha, nao uma funcao inteira.');
    }
    return lista.concat(dicasDeSintaxe(t, msg));
  }
  if (typeof f !== 'function') return ['nao consegui montar a funcao a partir do que voce escreveu'];
  var falhas = [];
  for (var i = 0; i < ex.testes.length; i++) {
    var t = ex.testes[i], obtido;
    try { obtido = f.apply(null, t.args); }
    catch (e) { falhas.push('teste ' + (i+1) + ' quebrou: ' + (e && e.message ? e.message : e)); continue; }
    if (!igual(obtido, t.esperado)) {
      falhas.push('teste ' + (i+1) + ': com ' + mostrar(t.args[0]) + ' esperava ' + mostrar(t.esperado) + ', veio ' + mostrar(obtido));
    }
  }

  // A dica que faltava, e ela vai NA FRENTE de tudo: se o andaime tem um `return`
  // de reserva depois da sua linha e a sua linha nao retorna nada, o teste sempre
  // recebe o valor de reserva. Sem dizer isso, "esperava X, veio null" parece erro
  // de logica — e foi por ai que o js/6 comeu 13 tentativas em 02/09 com a logica
  // JA CERTA desde a setima.
  if (falhas.length && papelDaResposta(ex) === 'precisa-retornar' && !/\breturn\b/.test(resposta)) {
    falhas.unshift('sua linha NAO DEVOLVE nada — ela calcula o valor e joga fora. '
      + 'Este exercicio monta `function f(...) { SUA LINHA  return <reserva>; }`, entao sem '
      + '`return` na sua linha o teste recebe sempre a reserva. A logica pode estar certa: '
      + 'confira se falta o `return`.');
  }
  return falhas;
}

/* ---------- dicas de sintaxe ----------
   A ferramenta, nunca a resposta. Nao viola a regra 1 do projeto: ela nao olha o que
   voce escreveu nem julga nada — so entrega o vocabulario. Pedir fica registrado
   (`usouSintaxe` na tentativa), porque saber QUAIS formas ainda nao estao na ponta da
   lingua e' o dado mais util que este app coleta sobre o estudo. */
function pediuSintaxe(){ return ler('estudo-sintaxe', []); }
function marcaPediu(chave){
  var p = pediuSintaxe();
  if (p.indexOf(chave) < 0) { p.push(chave); grava('estudo-sintaxe', p); }
}
function mostrarSintaxe(){
  var ex = lista()[atual], chave = trilha + ':' + ex.id;
  var texto = (typeof SINTAXE !== 'undefined') ? SINTAXE[chave] : null;
  var caixa = $('caixaSintaxe');
  if (!texto) {
    caixa.hidden = false;
    caixa.innerHTML = '<div class="rotulo">sintaxe</div>' +
      (trilha === 'teoria'
        ? 'Na teoria nao ha sintaxe pra lembrar — o que falta aqui e' + ' formular. Escreve do jeito torto mesmo e entrega.'
        : 'Este exercicio ainda nao tem dica escrita.');
    return;
  }
  marcaPediu(chave);
  caixa.hidden = false;
  caixa.innerHTML = '<div class="rotulo">sintaxe — a ferramenta, nao a resposta</div>' + texto;
  $('sintaxe').className = 'usado';
}

/* ---------- gravacao ---------- */
function gravaTentativa(reg){
  var h = historico(); h.push(reg); grava('estudo-hist', h);
  fetch('/api/tentativas', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(reg) })
    .then(function(r){ return r.json(); })
    .then(function(j){ marcaBanco(!!j.salvo); })
    .catch(function(){ marcaBanco(false); });
}
function marcaBanco(on){
  var el = $('banco');
  el.className = 'banco' + (on ? ' on' : '');
  el.textContent = on ? 'banco: gravando' : 'banco: so local';
}

/* ---------- tela ---------- */
var NOME_TRILHA = { ts:'TypeScript', js:'JavaScript', teoria:'Teoria' };

function render(){
  var ex = lista()[atual], f = feitos(), chave = trilha + ':' + ex.id;
  $('enunciado').innerHTML = '<h2>' + NOME_TRILHA[trilha] + ' &middot; ' +
    (trilha === 'teoria' ? 'questao ' : 'exercicio ') + ex.id + '</h2>' +
    '<div class="alvo">' + ex.alvo + '</div>' + ex.html;
  $('editor').value = rascunho(trilha, ex.id);
  $('editor').placeholder = trilha === 'teoria'
    ? 'explica com suas palavras, como se fosse em voz alta numa entrevista. frase torta serve — o que nao serve e pular pro gabarito.'
    : 'escreve e clica em conferir. chuta em 15 segundos, feio serve.';
  $('conferir').textContent = trilha === 'teoria' ? 'entregar e ver o gabarito' : 'conferir';
  $('gabarito').hidden = true;
  $('caixaSintaxe').hidden = true;
  $('sintaxe').className = pediuSintaxe().indexOf(trilha + ':' + ex.id) >= 0 ? 'usado' : '';
  $('tabs').innerHTML = lista().map(function(x, i){
    return '<button class="tab ' + (i === atual ? 'on' : '') + ' ' + (f.indexOf(trilha + ':' + x.id) >= 0 ? 'feito' : '') +
           '" data-i="' + i + '">' + x.id + '</button>';
  }).join('');
  Array.prototype.forEach.call($('tabs').querySelectorAll('.tab'), function(b){
    b.onclick = function(){ atual = +b.dataset.i; render(); };
  });
  Array.prototype.forEach.call(document.querySelectorAll('.trilha'), function(b){
    b.className = 'trilha' + (b.dataset.t === trilha ? ' on' : '');
  });
  var totais = EXERCICIOS.ts.length + EXERCICIOS.js.length + EXERCICIOS.teoria.length;
  $('placar').textContent = (pronto ? f.length + ' de ' + totais + ' resolvidos' : 'carregando compilador...') +
    ' · ' + historico().length + ' tentativas';
  renderHist(chave);
  $('saida').className = 'saida neutro';
  $('saida').textContent = trilha === 'teoria'
    ? 'escreve a explicacao e entrega. o gabarito so aparece depois — se voce espiar antes, a resposta parece obvia e voce nao descobre o que nao sabia.'
    : 'escreve e clica em conferir. voce so ve o erro depois de entregar.';
  focoEm = Date.now();
}

/* ---------- trilha Teoria ----------
   Aqui nao existe compilador pra julgar: quem julga e voce. O que a maquina faz e
   mostrar quais pontos da resposta esperada voce nao encostou — isso e PISTA, nao nota.
   Uma explicacao boa com outras palavras pode nao bater a regex; uma ruim pode bater. */
function cobertura(ex, resposta){
  return (ex.pontos || []).map(function(p){
    return { rotulo: p.rotulo, tem: p.rx.test(resposta) };
  });
}

function mostrarGabarito(ex, resposta){
  var cob = cobertura(ex, resposta);
  var faltou = cob.filter(function(c){ return !c.tem; }).length;
  $('gabarito').hidden = false;
  $('gabarito').innerHTML =
    '<h3>o que a resposta precisava encostar</h3>' +
    '<ul class="cobertura">' + cob.map(function(c){
      return '<li class="' + (c.tem ? 'sim' : 'nao') + '">' + (c.tem ? '✓' : '✗') + ' ' + c.rotulo + '</li>';
    }).join('') + '</ul>' +
    (faltou ? '' : '<p style="color:var(--muted);font-size:13px">encostou em tudo. leia o gabarito assim mesmo: bater palavra nao e o mesmo que explicar.</p>') +
    '<h3>gabarito</h3>' + ex.gabarito +
    '<div class="nota"><p>e agora a parte que vale: <b>voce sustentaria isso em voz alta, sem ler?</b></p>' +
    '<div class="nav">' +
    '<button class="principal" data-nota="expliquei">expliquei</button>' +
    '<button data-nota="faltou">faltou parte</button>' +
    '<button data-nota="nao-soube">nao soube</button>' +
    '</div></div>';
  Array.prototype.forEach.call($('gabarito').querySelectorAll('[data-nota]'), function(b){
    b.onclick = function(){ autoavaliar(ex, b.dataset.nota); };
  });
}

// A nota entra DEPOIS, atualizando a tentativa que ja foi gravada na entrega —
// assim uma resposta entregue e nunca avaliada nao some do historico.
function autoavaliar(ex, nota){
  var h = historico(), chave = trilha + ':' + ex.id;
  for (var i = h.length - 1; i >= 0; i--) {
    if (h[i].trilha + ':' + h[i].exercicio === chave) {
      h[i].nota = nota;
      h[i].acertou = nota === 'expliquei';
      grava('estudo-hist', h);
      fetch('/api/tentativas', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(h[i]) })
        .then(function(r){ return r.json(); }).then(function(j){ marcaBanco(!!j.salvo); })
        .catch(function(){ marcaBanco(false); });
      break;
    }
  }
  var f = feitos();
  if (nota === 'expliquei') { if (f.indexOf(chave) < 0) { f.push(chave); grava('estudo-feitos', f); } }
  else { var k = f.indexOf(chave); if (k >= 0) { f.splice(k, 1); grava('estudo-feitos', f); } }

  $('saida').className = 'saida ' + (nota === 'expliquei' ? 'ok' : 'neutro');
  $('saida').textContent = nota === 'expliquei'
    ? 'marcada como explicada. se bateu duvida na hora de clicar, refaz amanha sem olhar.'
    : (nota === 'faltou' ? 'marcada como parcial. reescreve a explicacao agora, com o gabarito fechado.'
                         : 'marcada como nao sabida. e essa a que vale mais: volta nela amanha.');
  render.chaveAtual = chave;
  renderHist(chave);
  var totais = EXERCICIOS.ts.length + EXERCICIOS.js.length + EXERCICIOS.teoria.length;
  $('placar').textContent = feitos().length + ' de ' + totais + ' resolvidos · ' + historico().length + ' tentativas';
  Array.prototype.forEach.call($('tabs').querySelectorAll('.tab'), function(b, i){
    var c = 'tab' + (i === atual ? ' on' : '') + (feitos().indexOf(trilha + ':' + lista()[i].id) >= 0 ? ' feito' : '');
    b.className = c;
  });
}

function renderHist(chave){
  var t = historico().filter(function(r){ return r.trilha + ':' + r.exercicio === chave; }).slice(-6);
  if (!t.length) { $('hist').innerHTML = '<div class="tent">nenhuma ainda</div>'; return; }
  $('hist').innerHTML = t.map(function(r, i){
    var q;
    if (r.trilha === 'teoria') {
      q = r.nota === 'expliquei' ? '<b class="v">expliquei</b>'
        : r.nota === 'faltou' ? '<b>faltou parte</b>'
        : r.nota === 'nao-soube' ? '<b>nao soube</b>'
        : '<b>sem nota</b>';
    } else {
      q = r.acertou ? '<b class="v">acertou</b>' : '<b>' + r.erros.length + ' erro(s)</b>';
    }
    var d = r.usouSintaxe ? ' <span title="consultou a sintaxe">[s]</span>' : '';
    return '<div class="tent">' + (i+1) + '. ' + q + d + ' &nbsp; ' + (r.resposta.length > 60 ? r.resposta.slice(0,60) + '...' : r.resposta) + '</div>';
  }).join('');
}

function conferir(){
  var ex = lista()[atual], r = $('editor').value;
  salvaRascunho(trilha, ex.id, r);
  if (!r.trim()) { $('saida').className = 'saida neutro'; $('saida').textContent = 'escreve alguma coisa. errado tambem vale.'; return; }
  if (trilha === 'ts' && !tsOk) { $('saida').className = 'saida erro'; $('saida').textContent = 'o compilador ainda nao carregou. precisa de internet.'; return; }

  // Teoria: nao ha veredito automatico. Grava a entrega, abre o gabarito, e a nota
  // vem do proprio aluno logo abaixo (autoavaliar). Uma explicacao curta demais nem
  // chega no gabarito — sem tentar de verdade, ler a resposta certa nao ensina nada.
  if (trilha === 'teoria') {
    if (r.trim().length < 40) {
      $('saida').className = 'saida neutro';
      $('saida').textContent = 'escreve mais. duas linhas no minimo — o exercicio aqui e formular, e uma frase solta nao formula nada.';
      return;
    }
    gravaTentativa({
      trilha: trilha, exercicio: ex.id, resposta: r, acertou: false, nota: null,
      usouSintaxe: pediuSintaxe().indexOf(trilha + ':' + ex.id) >= 0,
      erros: [], ms_pensando: focoEm ? Date.now() - focoEm : null,
      criado_em: new Date().toISOString()
    });
    $('saida').className = 'saida neutro';
    $('saida').textContent = 'entregue. compara com o gabarito abaixo e da a sua nota.';
    mostrarGabarito(ex, r);
    render.chaveAtual = trilha + ':' + ex.id;
    renderHist(render.chaveAtual);
    focoEm = Date.now();
    return;
  }

  var erros;
  try { erros = trilha === 'ts' ? checarTS(ex.contexto(r)) : checarJS(ex, r); }
  catch (e) { erros = ['erro inesperado: ' + (e && e.message ? e.message : e)]; }

  var acertou = erros.length === 0;
  gravaTentativa({
    trilha: trilha, exercicio: ex.id, resposta: r, acertou: acertou,
    usouSintaxe: pediuSintaxe().indexOf(trilha + ':' + ex.id) >= 0,
    erros: erros.slice(0, 6), ms_pensando: focoEm ? Date.now() - focoEm : null,
    criado_em: new Date().toISOString()
  });

  if (acertou) {
    var f = feitos(), ch = trilha + ':' + ex.id;
    if (f.indexOf(ch) < 0) { f.push(ch); grava('estudo-feitos', f); }
    $('saida').className = 'saida ok';
    $('saida').textContent = trilha === 'ts' ? 'zero erros. acertou.' : 'todos os testes passaram. acertou.';
  } else {
    $('saida').className = 'saida erro';
    $('saida').textContent = erros.slice(0, 4).join('\n\n');
  }
  render.chaveAtual = trilha + ':' + ex.id;
  renderHist(render.chaveAtual);
  var totais = EXERCICIOS.ts.length + EXERCICIOS.js.length + EXERCICIOS.teoria.length;
  $('placar').textContent = feitos().length + ' de ' + totais + ' resolvidos · ' + historico().length + ' tentativas';
  Array.prototype.forEach.call($('tabs').querySelectorAll('.tab'), function(b, i){
    if (feitos().indexOf(trilha + ':' + lista()[i].id) >= 0 && b.className.indexOf('feito') < 0) b.className += ' feito';
  });
  focoEm = Date.now();
}

/* ---------- exportar ---------- */
function resumo(){
  var h = historico(), linhas = ['# historico de estudo', 'total de tentativas: ' + h.length, ''];
  var porEx = {};
  h.forEach(function(r){ var k = r.trilha + ':' + r.exercicio; (porEx[k] = porEx[k] || []).push(r); });
  Object.keys(porEx).forEach(function(k){
    var t = porEx[k], acertos = t.filter(function(x){ return x.acertou; }).length;
    linhas.push('## ' + k + '  (' + t.length + ' tentativas, ' + acertos + ' acerto(s))');
    t.forEach(function(r, i){
      // Teoria nao tem certo/errado da maquina: o que vale registrar e a nota que ele
      // mesmo se deu, e a resposta inteira (e nela que da pra ver se a explicacao anda).
      if (r.trilha === 'teoria') {
        linhas.push((i+1) + '. ' + (r.nota || 'sem nota').toUpperCase());
        linhas.push('     ' + r.resposta.replace(/\n/g, '\n     '));
      } else {
        linhas.push((i+1) + '. ' + (r.acertou ? 'OK' : 'ERRO') + '  ' + JSON.stringify(r.resposta));
        if (!r.acertou) r.erros.forEach(function(e){ linhas.push('     ' + e.split('\n')[0]); });
      }
    });
    linhas.push('');
  });
  return linhas.join('\n');
}

$('conferir').onclick = conferir;
$('anterior').onclick = function(){ atual = (atual - 1 + lista().length) % lista().length; render(); };
$('proximo').onclick  = function(){ atual = (atual + 1) % lista().length; render(); };
$('sintaxe').onclick  = mostrarSintaxe;
$('limpar').onclick   = function(){ $('editor').value = ''; };
$('editor').addEventListener('input', function(){ salvaRascunho(trilha, lista()[atual].id, $('editor').value); });
$('editor').addEventListener('keydown', function(e){ if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') conferir(); });
Array.prototype.forEach.call(document.querySelectorAll('.trilha'), function(b){
  b.onclick = function(){ trilha = b.dataset.t; atual = 0; render(); };
});
$('copiar').onclick = function(){
  var txt = resumo();
  if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function(){ alert('copiado. cola na conversa.'); });
  else { prompt('copia isso:', txt); }
};
$('baixar').onclick = function(){
  var b = new Blob([JSON.stringify(historico(), null, 2)], { type: 'application/json' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(b); a.download = 'estudo-historico.json'; a.click();
};

render();
marcaBanco(false);
/* ---------- carregar as definicoes do TypeScript ----------
   ARMADILHA QUE CUSTOU CARO (03/09/2026): o app baixava `lib.es2020.full.d.ts`, que
   tem 1.074 bytes e e' so um INDICE de `/// <reference lib="..." />`. Como o nosso host
   e' artificial (nao tem filesystem), essas referencias nunca eram resolvidas e o
   compilador respondia "TS2318: Cannot find global type 'Array'" para QUALQUER coisa —
   inclusive para a resposta certa. A trilha TS inteira estava quebrada desde sempre e
   ninguem sabia, porque ate entao so a de JavaScript tinha sido usada.
   O arquivo com as definicoes de verdade e' o `lib.es5.d.ts` (218 KB). */
var LIBS = [
  'lib.es5.d.ts',                 // Array, Boolean, Function, Record... o essencial
  'lib.es2015.core.d.ts',         // Object.assign, Array.find, String.startsWith
  'lib.es2015.collection.d.ts',   // Set e Map (a questao J4 fala de Set)
  'lib.es2016.array.include.d.ts',// .includes
  'lib.es2017.object.d.ts'        // Object.entries / values
];

/* O app conferindo a si mesmo antes de deixar voce estudar: compila um trecho que
   TEM que passar. Se nao passar, a culpa e da lib e nao da sua resposta — e voce
   precisa saber disso ANTES de gastar quatro tentativas numa resposta correta. */
function libEstaBoa(){
  try {
    return checarTS('const n: number = 1;\nconst l: string[] = ["a"];\nconst ok: boolean = l.every(function(x){ return x.length > n; });').length === 0;
  } catch (e) { return false; }
}

(function carregarLib(){
  var base = 'https://unpkg.com/typescript@5.9.3/lib/';
  Promise.all(LIBS.map(function(a){
    return fetch(base + a).then(function(r){ return r.status === 200 ? r.text() : ''; }).catch(function(){ return ''; });
  })).then(function(partes){
    // as linhas de /// <reference lib> nao sao resolviveis aqui; tira pra nao poluir
    lib = partes.join('\n').replace(/\/\/\/\s*<reference\s+lib=[^>]*>/g, '');
    pronto = true;
    if (!lib.trim()) {
      tsOk = false; render();
      $('saida').className = 'saida erro';
      $('saida').textContent = 'nao consegui baixar as definicoes do TypeScript (precisa de internet). As trilhas de JavaScript e Teoria funcionam normalmente.';
      return;
    }
    tsOk = true;
    if (!libEstaBoa()) {
      tsOk = false; render();
      $('saida').className = 'saida erro';
      $('saida').textContent = 'as definicoes do TypeScript baixaram incompletas — o compilador esta recusando ate codigo correto.\n\n'
        + 'NAO e a sua resposta. Recarrega a pagina (Ctrl+Shift+R). Se continuar, use as trilhas de JavaScript e Teoria.';
      return;
    }
    render();
  });
})();
