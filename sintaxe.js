// Dicas de SINTAXE — a ferramenta, nunca a resposta.
//
// Nasceu em 03/09/2026, de uma observação dele: estudando com outra IA, pedia pra não
// receber dica, mas quando travava por não lembrar do `.every` bastava alguém dizer
// "você precisa do .every" e ele desenvolvia sozinho.
//
// A distinção que isso revela, e que vale pra ferramenta inteira:
//   "não sei o que fazer"     -> problema de raciocínio. É o exercício. Ele resolve.
//   "não sei como se escreve" -> problema de vocabulário. Sofrer aí não ensina nada.
//
// Regra ao escrever qualquer dica nova: o EXEMPLO usa outro contexto (números, frutas,
// pedidos) — nunca o caso do exercício. Se der pra copiar o exemplo e colar como
// resposta, a dica está errada.

var SINTAXE = {

// ---------------- JavaScript ----------------
'js:1': '<b>Guardar num nome:</b> <code>const nome = valor;</code>'+
  '<p>O <code>;</code> no fim fecha a linha. Sem ele, ela gruda na próxima e o erro aparece no lugar errado.</p>'+
  '<pre>const total = pedido.valor;</pre>',

'js:2': '<b>Valor reserva com <code>||</code>:</b> devolve o da direita quando o da esquerda é'+
  ' vazio, <code>null</code> ou <code>undefined</code>.'+
  '<pre>const cor = config.cor || "azul";\nconst lista = talvezLista || [];</pre>'+
  '<p>Objeto vazio se escreve <code>{}</code>; lista vazia, <code>[]</code>.</p>',

'js:3': '<b>Ponto × colchete:</b> o ponto pede um nome <i>fixo</i>, escrito por você. O colchete'+
  ' aceita uma <i>variável</i> com o nome dentro.'+
  '<pre>precos.banana   // a chave é literalmente "banana"\nprecos[fruta]   // a chave é o que estiver em fruta</pre>'+
  '<p>Dá pra encadear com o valor reserva: <code>(a || {})[b]</code>.</p>',

'js:4': '<b><code>!!</code> converte pra sim/não de verdade:</b> transforma qualquer valor em'+
  ' <code>true</code> ou <code>false</code>.'+
  '<pre>!!"texto"   // true\n!!null      // false\n!!0         // false</pre>'+
  '<p>Para "A ou (B e o campo de B)": <code>!!(a || (b &amp;&amp; b.campo))</code>.</p>',

'js:5': '<b><code>.every(fn)</code>:</b> devolve <code>true</code> se <b>todos</b> os itens da lista'+
  ' passarem no teste. Basta um falhar para dar <code>false</code>.'+
  '<pre>[1, 2, 3].every(n =&gt; n &gt; 0)      // true\n[1, -2, 3].every(n =&gt; n &gt; 0)     // false</pre>'+
  '<p>A função de dentro recebe um item por vez. Se precisar de outro valor junto, ele já está'+
  ' disponível ali: <code>itens.every(i =&gt; checa(outro, i))</code>.</p>',

'js:6': '<b>Devolver no meio da função:</b> <code>if (condição) return valor;</code> — tudo numa'+
  ' linha, sem chaves.'+
  '<pre>if (idade &gt;= 18) return { ok: true, tipo: "adulto" };</pre>'+
  '<p><b>Objeto literal</b> usa chaves e os textos vão entre aspas: <code>{ campo: "texto" }</code>.'+
  ' Colchetes <code>[ ]</code> são <i>lista</i>, não objeto.</p>'+
  '<p>⚠ Se a sua linha não tiver <code>return</code>, ela calcula o valor e joga fora.</p>',

'js:7': '<b><code>.filter(fn)</code>:</b> devolve uma <b>lista nova</b> só com os itens que passarem'+
  ' no teste (o <code>.every</code> devolve sim/não; o <code>.filter</code> devolve itens).'+
  '<pre>[1, -2, 3].filter(n =&gt; n &gt; 0)    // [1, 3]</pre>'+
  '<p>Para inverter um teste, use <code>!</code> na frente: <code>itens.filter(i =&gt; !checa(i))</code>.</p>',

'js:bonus': '<b>Função inteira:</b>'+
  '<pre>function nomeDaFuncao(parametro) {\n  return algumaCoisa;\n}</pre>'+
  '<p><code>&amp;&amp;</code> é "e" (as duas coisas), <code>||</code> é "ou". Para exigir que um campo'+
  ' exista <b>e</b> outro não seja verdadeiro: <code>!!(a &amp;&amp; !b)</code>.</p>'+
  '<p>Texto vazio (<code>""</code>) conta como "não tem" — <code>!!""</code> dá <code>false</code>.</p>',

// ---------------- TypeScript ----------------
'ts:1': '<b>Anotar um parâmetro:</b> escreve <code>: tipo</code> logo depois do nome dele, dentro'+
  ' dos parênteses. O resto da função não muda.'+
  '<pre>function repetir(vezes: number) {</pre>'+
  '<p>Número é <code>number</code>. TypeScript é o seu JavaScript + essas anotações; nada mais.</p>',

'ts:2': '<b>Texto é <code>string</code>.</b>'+
  '<pre>function saudar(nome: string) {</pre>'+
  '<p>Sim/não é <code>boolean</code>. Número é <code>number</code>. São esses três o dia inteiro.</p>',

'ts:3': '<b>Lista:</b> o tipo do que vai dentro, seguido de <code>[]</code>.'+
  '<pre>function somar(valores: number[]) {\nfunction juntar(nomes: string[]) {</pre>'+
  '<p><code>number[]</code> é "lista de números". <code>string[]</code>, "lista de textos".</p>',

'ts:4': '<b>"Ou isto, ou aquilo":</b> separa os tipos com a barra em pé <code>|</code>.'+
  '<pre>function ver(id: number | null) {\nlet resposta: string | undefined;</pre>'+
  '<p>Lê-se "number OU null". Serve para qualquer combinação de tipos.</p>',

'ts:5': '<b>Campo dentro de interface:</b> <code>nome: tipo;</code>, um por linha, com ponto e vírgula.'+
  '<pre>interface Pedido {\n  valor: number;\n  cupom: string | null;\n}</pre>'+
  '<p>A interface descreve o <i>formato</i> de um objeto. Um campo que pode não ter valor leva'+
  ' <code>| null</code>.</p>',

'ts:6': '<b>Mesma forma do 5:</b> <code>nome: tipo;</code> dentro das chaves da interface.'+
  '<pre>interface Conta {\n  saldo: number;\n  limite: number | null;\n}</pre>',

'ts:7': '<b>Mesma forma, base diferente:</b> aqui o campo guarda texto.'+
  '<pre>interface Autor {\n  apelido: string | null;\n}</pre>',

'ts:8': '<b>Tipo de retorno:</b> vai <b>depois do fecha-parênteses</b>, antes da chave.'+
  '<pre>function ehMaior(idade: number): boolean {\nfunction nomeDe(id: number): string {</pre>'+
  '<p>Lê-se: recebe isso, devolve aquilo.</p>',

'ts:9': '<b>Só o parâmetro por enquanto:</b> <code>function nome(param: Tipo) {</code> — sem dizer'+
  ' o retorno.'+
  '<pre>function processar(pedido: Pedido) {</pre>'+
  '<p>Um tipo pode ser o nome de uma interface, não só <code>number</code> ou <code>string</code>.</p>',

'ts:10': '<b>Objeto como tipo de retorno:</b> descreve a forma entre chaves, ali mesmo na linha.'+
  '<pre>function medir(x: number): { largura: number; nota: string | null } {</pre>'+
  '<p>É igual a uma interface, mas escrita direto no lugar. Os campos vão separados por'+
  ' <code>;</code>.</p>',

'ts:11': '<b>Objeto com chaves que você não sabe de antemão:</b> <code>Record&lt;string, X&gt;</code>'+
  ' — "objeto de chave texto e valor X".'+
  '<pre>const precos: Record&lt;string, number&gt; = { banana: 3 };</pre>'+
  '<p>E um <b>texto específico</b> também é um tipo: <code>"na"</code> vale como tipo, e'+
  ' <code>true | "na"</code> significa "ou verdadeiro, ou exatamente o texto na".</p>',

'ts:bonus': '<b>Interface inteira:</b>'+
  '<pre>interface Contrato {\n  campo: string;\n  outro: number | null;\n  aninhado: { estado: string } | null;\n}</pre>'+
  '<p><b>Campo que pode não vir</b> leva <code>?</code> antes dos dois pontos: <code>nome?: tipo</code>.'+
  ' É diferente de <code>| null</code> — <code>?</code> é "pode não existir", <code>| null</code> é'+
  ' "existe e vale nada".</p>'+
  '<p>Um campo que é objeto pode ter a forma descrita entre chaves. Lê o erro do compilador:'+
  ' ele diz qual campo falta e como está sendo usado.</p>',

};
