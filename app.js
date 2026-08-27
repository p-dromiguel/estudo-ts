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
    return lista;
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
  return falhas;
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
function render(){
  var ex = lista()[atual], f = feitos(), chave = trilha + ':' + ex.id;
  $('enunciado').innerHTML = '<h2>' + (trilha === 'ts' ? 'TypeScript' : 'JavaScript') + ' &middot; exercicio ' + ex.id + '</h2>' +
    '<div class="alvo">' + ex.alvo + '</div>' + ex.html;
  $('editor').value = rascunho(trilha, ex.id);
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
  var totais = EXERCICIOS.ts.length + EXERCICIOS.js.length;
  $('placar').textContent = (pronto ? f.length + ' de ' + totais + ' resolvidos' : 'carregando compilador...') +
    ' · ' + historico().length + ' tentativas';
  renderHist(chave);
  $('saida').className = 'saida neutro';
  $('saida').textContent = 'escreve e clica em conferir. voce so ve o erro depois de entregar.';
  focoEm = Date.now();
}

function renderHist(chave){
  var t = historico().filter(function(r){ return r.trilha + ':' + r.exercicio === chave; }).slice(-6);
  if (!t.length) { $('hist').innerHTML = '<div class="tent">nenhuma ainda</div>'; return; }
  $('hist').innerHTML = t.map(function(r, i){
    var q = r.acertou ? '<b class="v">acertou</b>' : '<b>' + r.erros.length + ' erro(s)</b>';
    return '<div class="tent">' + (i+1) + '. ' + q + ' &nbsp; ' + (r.resposta.length > 60 ? r.resposta.slice(0,60) + '...' : r.resposta) + '</div>';
  }).join('');
}

function conferir(){
  var ex = lista()[atual], r = $('editor').value;
  salvaRascunho(trilha, ex.id, r);
  if (!r.trim()) { $('saida').className = 'saida neutro'; $('saida').textContent = 'escreve alguma coisa. errado tambem vale.'; return; }
  if (trilha === 'ts' && !tsOk) { $('saida').className = 'saida erro'; $('saida').textContent = 'o compilador ainda nao carregou. precisa de internet.'; return; }

  var erros;
  try { erros = trilha === 'ts' ? checarTS(ex.contexto(r)) : checarJS(ex, r); }
  catch (e) { erros = ['erro inesperado: ' + (e && e.message ? e.message : e)]; }

  var acertou = erros.length === 0;
  gravaTentativa({
    trilha: trilha, exercicio: ex.id, resposta: r, acertou: acertou,
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
  var totais = EXERCICIOS.ts.length + EXERCICIOS.js.length;
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
      linhas.push((i+1) + '. ' + (r.acertou ? 'OK' : 'ERRO') + '  ' + JSON.stringify(r.resposta));
      if (!r.acertou) r.erros.forEach(function(e){ linhas.push('     ' + e.split('\n')[0]); });
    });
    linhas.push('');
  });
  return linhas.join('\n');
}

$('conferir').onclick = conferir;
$('anterior').onclick = function(){ atual = (atual - 1 + lista().length) % lista().length; render(); };
$('proximo').onclick  = function(){ atual = (atual + 1) % lista().length; render(); };
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
fetch('https://unpkg.com/typescript@5.9.3/lib/lib.es2020.full.d.ts')
  .then(function(r){ return r.text(); })
  .then(function(txt){ lib = txt; tsOk = true; pronto = true; render(); })
  .catch(function(){ pronto = true; render(); $('saida').className = 'saida erro'; $('saida').textContent = 'nao consegui baixar a biblioteca do TypeScript. a trilha de JavaScript funciona mesmo assim.'; });
