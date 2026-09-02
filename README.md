# estudo-ts

Exercícios de TypeScript e JavaScript corrigidos pelo **compilador de verdade**, mais uma trilha de
teoria em que você explica e se avalia — tudo com histórico de
tentativas gravado. Página estática + uma função serverless. Roda em qualquer PC com navegador,
sem instalar nada.

## Duas regras de projeto que não mudam

**1. Só corrige depois de submeter.** Correção ao vivo deixa acertar por tentativa e erro,
mexendo até ficar verde, sem aprender nada. Você escreve, entrega, e só então descobre.

**2. Toda tentativa é gravada, inclusive (e principalmente) as erradas.** É delas que sai a curva.
Acerto sozinho não diz nada; o que diz é quantas tentativas levaram até ele e onde a mão escorregou.

## Como corrige

**Trilha TypeScript** — monta um arquivo `.ts` completo com a sua resposta dentro e roda o
compilador oficial (`typescript@5.9.3`) no navegador. Zero diagnóstico é acerto. Não é comparação
com um gabarito: qualquer solução correta passa, inclusive uma que ninguém tinha pensado.

Cada exercício carrega uma **prova** no contexto que fecha a porta para resposta pela metade. No
exercício 1, por exemplo, existe um `advbox_customer_id: null` lá embaixo: se faltar o `| null`,
o compilador denuncia.

**Trilha JavaScript** — monta a função e **roda** com entradas conhecidas, comparando o resultado.
Todos os testes passando é acerto.

**Trilha Teoria** — aqui não há compilador para julgar: você escreve a explicação **com suas
palavras**, entrega, e só então vê o gabarito. Quem dá a nota é você (*expliquei* / *faltou parte* /
*não soube*), e só *expliquei* conta como resolvido.

A máquina ajuda de um jeito só: lista os pontos que a resposta esperada precisava encostar e
marca quais você encostou. Isso é **pista, não nota** — uma explicação boa com outras palavras
pode não bater a busca, e uma ruim pode bater. Resposta com menos de 40 caracteres nem abre o
gabarito: sem tentar formular de verdade, ler a resposta certa não ensina nada.

São **29 questões em 5 blocos**, e o id diz de qual bloco é:

| bloco | id | o que cobre |
|---|---|---|
| TypeScript | `1`–`8` | `type` × `interface`, `Omit`, união literal, `strict`, `any` × `unknown`, "TS existe em runtime?", união discriminada, defender uma decisão de projeto |
| Node | `N1`–`N4` | `dependencies` × `dev`, thread única e event loop, `process.env` e segredo, middleware e ordem |
| JavaScript | `J1`–`J4` | `==` × `===`, o `catch` que virou "não existe", escape em string, `Set` × `Array` |
| Backend | `B1`–`B5` | 4xx × 5xx, idempotência de webhook, chave de ligação entre sistemas, pool de conexão, rate limit |
| Entrevista | `E1`–`E8` | `var`/`let`/`const`, `null` × `undefined`, callback→Promise→async, verbos HTTP, CORS, JOINs, índice, autenticação × autorização |

As **6 primeiras** não são aleatórias: são o **teste combinado em 01/09** para decidir se
TypeScript volta ao currículo. Escrever TS já se escreve — o que faltava era sustentar em voz
alta, que é o que a entrevista cobra.

Os blocos **Node**, **JavaScript** e **Backend** quase não têm pergunta inventada: quase toda uma
delas é **um bug que este sistema realmente teve** — a esteira de reuniões que mostrava tela vazia
quando o ADVBOX oscilava, a rota dos Casos Sensíveis que nunca casava, o Dossiê morto 2 dias por
um `Set` lido com `.includes`, o resumo de esforço parado 22 dias porque um `400` foi tratado como
lista vazia. Explicar esses é mais fácil do que decorar teoria, e vale mais numa entrevista:
você viveu cada um.

O bloco **Entrevista** é o feijão com arroz — "básicas" no sentido de comuns, não de fáceis.
Quase todo mundo responde pela metade, e a metade que falta é sempre a mesma; o gabarito marca
exatamente onde.

Faça a Teoria **depois** de escrever, nunca antes. E não precisa fazer as 29 de uma vez: é
biblioteca, não prova.

Verificado: 9 casos de TypeScript e 8 de JavaScript passam com a resposta certa, e as respostas
pela metade são recusadas.

## Rodar local

Abre o `index.html` no navegador. Precisa de internet, porque ele baixa o compilador de um CDN.
Sem `DATABASE_URL` configurada, o histórico fica no `localStorage` e os botões de copiar e baixar
continuam funcionando.

## Deploy na Vercel

1. Sobe o repositório e importa na Vercel. Não precisa configurar build: é estático + `/api`.
2. Cria um projeto no **Neon** — **separado**, nunca o banco de produção do escritório.
3. Roda `sql/schema.sql` no console do Neon.
4. Na Vercel, em *Settings > Environment Variables*, põe `DATABASE_URL` com a string do Neon.
5. Redeploy. A etiqueta no topo da página passa de `banco: só local` para `banco: gravando`.

## Ler o histórico depois

```bash
curl "https://SEU-APP.vercel.app/api/tentativas?limite=300"
```

Devolve as tentativas mais recentes: trilha, exercício, o que foi escrito, se acertou, os erros e
quanto tempo levou entre abrir o exercício e submeter.

Sem o banco, dá no mesmo pelos botões **copiar histórico** (resumo em texto, pronto para colar numa
conversa) e **baixar json**.

## Estrutura

```
index.html        a tela
exercicios.js     a biblioteca: duas trilhas, 8 exercícios cada
app.js            corretores, gravação e exportação
api/tentativas.js POST grava, GET lista (Vercel + Neon)
sql/schema.sql    uma tabela, uma linha por tentativa
```

Os enunciados saem de `services/posvenda-etapa.js` do sistema real, não de tutorial.
