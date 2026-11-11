# Desafio: testes de Campo Minado

## Colaboradores

- Matheus Goulart de Alencar 24131995-2
- Miguel Falcão Costacurta 24011302-2

## Especificação adotada

Jogo em JavaScript, com tabuleiro de **14 linhas × 18 colunas** e **40 bombas**. As coordenadas são `linha, coluna`, iniciando em zero. A partida começa em `em_andamento`, termina em `perdeu` ao revelar uma bomba e em `venceu` quando todas as 212 casas seguras forem reveladas. Bandeiras não revelam casas nem contam como vitória. Uma casa segura mostra o número de bombas nas até oito posições vizinhas; casas de valor zero abrem recursivamente a região segura e sua borda numérica. Revelar uma casa já aberta ou com bandeira não altera o estado. Depois do fim, nenhuma jogada altera o tabuleiro.

Para permitir testes repetíveis, a implementação deve aceitar posições de bombas injetadas. Na partida comum, elas podem ser sorteadas. A especificação original não fixa garantia de primeira jogada segura; esta suíte **não exige** essa regra.

## API implementada em `src/jogo.js`

Exportações CommonJS:

- `criarJogo({ linhas = 14, colunas = 18, bombas = 40, posicoesBombas })`: devolve um estado. `posicoesBombas` é uma lista de pares `[linha, coluna]` distintos, com tamanho igual a `bombas`; posições inválidas ou duplicadas lançam `RangeError`.
- `revelar(estado, linha, coluna)` e `alternarBandeira(estado, linha, coluna)`: devolvem o novo estado; jogadas fora do tabuleiro lançam `RangeError`.
- `obterCasa(estado, linha, coluna)`: devolve `{ revelada: boolean, bandeira: boolean, bombasVizinhas: number, bomba: boolean }`. O campo `bomba` serve à verificação interna e não deve aparecer na interface do jogador antes do fim.
- `obterStatus(estado)`: devolve `em_andamento`, `venceu` ou `perdeu`.

As funções podem usar estado imutável ou mutável; os testes usam sempre o retorno da jogada.

## Casos de teste

| ID | Cenário e resultado esperado |
| --- | --- |
| CM01 | Criação padrão: 14 × 18, exatamente 40 bombas e status inicial em andamento. |
| CM02 | Posição repetida, fora dos limites ou quantidade incorreta de bombas: `RangeError`. |
| CM03 | Vizinhança conta bomba nas oito direções e respeita bordas/cantos. |
| CM04 | Revelar casa numerada mostra somente essa casa. |
| CM05 | Revelar zero expande a região e não abre bombas. |
| CM06 | Bandeira alterna ligada/desligada; casa marcada não é revelada. |
| CM07 | Revelar bomba encerra em derrota; ação posterior não altera estado. |
| CM08 | Revelar todas as casas seguras encerra em vitória, mesmo sem marcar bombas. |
| CM09 | Coordenada inválida em jogada/consulta lança `RangeError`. |

## Como os testes funcionam

`tests/jogo.test.js` usa `node:test` e `node:assert/strict`. Cada teste cria um tabuleiro determinístico com posições de bombas conhecidas, executa `src/jogo.js` e verifica estado, vizinhança e transições. Execute `npm test` com Node.js 20 ou superior. **Resultado verificado: 9 testes aprovados.**
