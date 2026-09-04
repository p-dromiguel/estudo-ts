// Dicas de SINTAXE — a ferramenta, nunca a resposta.
//
// Nasceu em 03/09/2026, de uma observacao dele: estudando com o Gemini, pedia pra nao
// receber dica, mas quando travava por nao lembrar do `.every` bastava alguem dizer
// "voce precisa do .every" e ele desenvolvia sozinho.
//
// A distincao que isso revela, e que vale pra ferramenta inteira:
//   "nao sei o que fazer"     -> problema de raciocinio. E' o exercicio. Ele resolve.
//   "nao sei como se escreve" -> problema de vocabulario. Sofrer ai nao ensina nada.
//
// Regra ao escrever qualquer dica nova: o EXEMPLO usa outro contexto (numeros, frutas,
// pedidos) — nunca o caso do exercicio. Se der pra copiar o exemplo e colar como
// resposta, a dica esta errada.

var SINTAXE = {

// ---------------- JavaScript ----------------
'js:1': '<b>Guardar num nome:</b> <code>const nome = valor;</code>'+
  '<p>O <code>;</code> no fim fecha a linha. Sem ele, ela gruda na proxima e o erro aparece no lugar errado.</p>'+
  '<pre>const total = pedido.valor;</pre>',

'js:2': '<b>Valor reserva com <code>||</code>:</b> devolve o da direita quando o da esquerda e' +
  ' vazio, <code>null</code> ou <code>undefined</code>.'+
  '<pre>const cor = config.cor || "azul";\nconst lista = talvezLista || [];</pre>'+
  '<p>Objeto vazio se escreve <code>{}</code>; lista vazia, <code>[]</code>.</p>',

'js:3': '<b>Ponto x colchete:</b> o ponto pede um nome <i>fixo</i>, escrito por voce. O colchete'+
  ' aceita uma <i>variavel</i> com o nome dentro.'+
  '<pre>precos.banana   // a chave e literalmente "banana"\nprecos[fruta]   // a chave e o que estiver em fruta</pre>'+
  '<p>Dá pra encadear com o valor reserva: <code>(a || {})[b]</code>.</p>',

'js:4': '<b><code>!!</code> converte pra sim/nao de verdade:</b> transforma qualquer valor em'+
  ' <code>true</code> ou <code>false</code>.'+
  '<pre>!!"texto"   // true\n!!null      // false\n!!0         // false</pre>'+
  '<p>Para "A ou (B e o campo de B)": <code>!!(a || (b &amp;&amp; b.campo))</code>.</p>',

'js:5': '<b><code>.every(fn)</code>:</b> devolve <code>true</code> se <b>todos</b> os itens da lista'+
  ' passarem no teste. Basta um falhar para dar <code>false</code>.'+
  '<pre>[1, 2, 3].every(n =&gt; n &gt; 0)      // true\n[1, -2, 3].every(n =&gt; n &gt; 0)     // false</pre>'+
  '<p>A funcao de dentro recebe um item por vez. Se precisar de outro valor junto,'+
  ' ele ja esta disponivel ali: <code>itens.every(i =&gt; checa(outro, i))</code>.</p>',

'js:6': '<b>Devolver no meio da funcao:</b> <code>if (condicao) return valor;</code> — tudo numa linha,'+
  ' sem chaves.'+
  '<pre>if (idade &gt;= 18) return { ok: true, tipo: "adulto" };</pre>'+
  '<p><b>Objeto literal</b> usa chaves e os textos vao entre aspas: <code>{ campo: "texto" }</code>.'+
  ' Colchetes <code>[ ]</code> sao <i>lista</i>, nao objeto.</p>'+
  '<p>⚠ Se a sua linha nao tiver <code>return</code>, ela calcula o valor e joga fora.</p>',

'js:7': '<b><code>.filter(fn)</code>:</b> devolve uma <b>lista nova</b> so com os itens que passarem'+
  ' no teste (o <code>.every</code> devolve sim/nao; o <code>.filter</code> devolve itens).'+
  '<pre>[1, -2, 3].filter(n =&gt; n &gt; 0)    // [1, 3]</pre>'+
  '<p>Para inverter um teste, use <code>!</code> na frente: <code>itens.filter(i =&gt; !checa(i))</code>.</p>',

'js:bonus': '<b>Funcao inteira:</b>'+
  '<pre>function nomeDaFuncao(parametro) {\n  return algumaCoisa;\n}</pre>'+
  '<p><code>&amp;&amp;</code> e "e" (as duas coisas), <code>||</code> e "ou". Para exigir que um campo'+
  ' exista <b>e</b> outro nao seja verdadeiro: <code>!!(a &amp;&amp; !b)</code>.</p>'+
  '<p>Texto vazio (<code>""</code>) conta como "nao tem" — <code>!!""</code> da <code>false</code>.</p>',

// ---------------- TypeScript ----------------
'ts:1': '<b>Anotar um parametro:</b> escreve <code>: tipo</code> logo depois do nome dele, dentro do'+
  ' parenteses. O resto da funcao nao muda.'+
  '<pre>function repetir(vezes: number) {</pre>'+
  '<p>Numero e <code>number</code>. TypeScript e o seu JavaScript + essas anotacoes; nada mais.</p>',

'ts:2': '<b>Texto e <code>string</code>.</b>'+
  '<pre>function saudar(nome: string) {</pre>'+
  '<p>Sim/nao e <code>boolean</code>. Numero e <code>number</code>. Sao esses tres o dia inteiro.</p>',

'ts:3': '<b>Lista:</b> o tipo do que vai dentro, seguido de <code>[]</code>.'+
  '<pre>function somar(valores: number[]) {\nfunction juntar(nomes: string[]) {</pre>'+
  '<p><code>number[]</code> e "lista de numeros". <code>string[]</code>, "lista de textos".</p>',

'ts:4': '<b>"Ou isto, ou aquilo":</b> separa os tipos com a barra em pe <code>|</code>.'+
  '<pre>function ver(id: number | null) {\nlet resposta: string | undefined;</pre>'+
  '<p>Le-se "number OU null". Serve para qualquer combinacao de tipos.</p>',

'ts:5': '<b>Campo dentro de interface:</b> <code>nome: tipo;</code>, um por linha, com ponto e virgula.'+
  '<pre>interface Pedido {\n  valor: number;\n  cupom: string | null;\n}</pre>'+
  '<p>A interface descreve o <i>formato</i> de um objeto. Um campo que pode nao ter valor leva'+
  ' <code>| null</code>.</p>',

'ts:6': '<b>Mesma forma do 5:</b> <code>nome: tipo;</code> dentro das chaves da interface.'+
  '<pre>interface Conta {\n  saldo: number;\n  limite: number | null;\n}</pre>',

'ts:7': '<b>Mesma forma, base diferente:</b> aqui o campo guarda texto.'+
  '<pre>interface Autor {\n  apelido: string | null;\n}</pre>',

'ts:8': '<b>Tipo de retorno:</b> vai <b>depois do fecha-parenteses</b>, antes da chave.'+
  '<pre>function ehMaior(idade: number): boolean {\nfunction nomeDe(id: number): string {</pre>'+
  '<p>Le-se: recebe isso, devolve aquilo.</p>',

'ts:9': '<b>So o parametro por enquanto:</b> <code>function nome(param: Tipo) {</code> — sem dizer o'+
  ' retorno.'+
  '<pre>function processar(pedido: Pedido) {</pre>'+
  '<p>Um tipo pode ser o nome de uma interface, nao so <code>number</code> ou <code>string</code>.</p>',

'ts:10': '<b>Objeto como tipo de retorno:</b> descreve a forma entre chaves, ali mesmo na linha.'+
  '<pre>function medir(x: number): { largura: number; nota: string | null } {</pre>'+
  '<p>E igual a uma interface, mas escrita direto no lugar. Os campos vao separados por'+
  ' <code>;</code>.</p>',

'ts:11': '<b>Objeto com chaves que voce nao sabe de antemao:</b> <code>Record&lt;string, X&gt;</code>'+
  ' — "objeto de chave texto e valor X".'+
  '<pre>const precos: Record&lt;string, number&gt; = { banana: 3 };</pre>'+
  '<p>E um <b>texto especifico</b> tambem e um tipo: <code>"na"</code> vale como tipo, e'+
  ' <code>true | "na"</code> significa "ou verdadeiro, ou exatamente o texto na".</p>',

'ts:bonus': '<b>Interface inteira:</b>'+
  '<pre>interface Contrato {\n  campo: string;\n  outro: number | null;\n  aninhado: { estado: string } | null;\n}</pre>'+
  '<p><b>Campo que pode nao vir</b> leva <code>?</code> antes dos dois pontos: <code>nome?: tipo</code>.'+' E diferente de <code>| null</code> — <code>?</code> e "pode nao existir", <code>| null</code> e "existe e vale nada".</p>'+'<p>Um campo que e objeto pode ter a forma descrita entre chaves. Le o erro do'+
  ' compilador: ele diz qual campo falta e como esta sendo usado.</p>',

};
