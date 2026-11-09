const test = require('node:test');
const assert = require('node:assert/strict');
const { criarJogo, revelar, alternarBandeira, obterCasa, obterStatus } = require('../src/jogo.js');

const minas = Array.from({ length: 40 }, (_, i) => [Math.floor(i / 18), i % 18]);
const novo = () => criarJogo({ posicoesBombas: minas });

test('CM01: dimensões, 40 bombas e estado inicial', () => {
  const jogo = novo();
  let total = 0;
  for (let l = 0; l < 14; l++) for (let c = 0; c < 18; c++) total += Number(obterCasa(jogo, l, c).bomba);
  assert.equal(total, 40);
  assert.equal(obterStatus(jogo), 'em_andamento');
  assert.equal(obterCasa(jogo, 13, 17).revelada, false);
});

test('CM02: configuração de bombas inválida', () => {
  assert.throws(() => criarJogo({ posicoesBombas: [...minas.slice(0, 39), minas[0]] }), RangeError);
  assert.throws(() => criarJogo({ posicoesBombas: minas.slice(0, 39) }), RangeError);
  assert.throws(() => criarJogo({ posicoesBombas: [...minas.slice(0, 39), [14, 0]] }), RangeError);
});

test('CM03: contagem inclui diagonais e respeita borda', () => {
  const jogo = novo();
  assert.equal(obterCasa(jogo, 3, 0).bombasVizinhas, 2);
  assert.equal(obterCasa(jogo, 3, 4).bombasVizinhas, 1);
  assert.equal(obterCasa(jogo, 13, 17).bombasVizinhas, 0);
});

test('CM04: casa numerada abre sem expansão', () => {
  const jogo = revelar(novo(), 3, 0);
  assert.equal(obterCasa(jogo, 3, 0).revelada, true);
  assert.equal(obterCasa(jogo, 4, 0).revelada, false);
});

test('CM05: zero expande sem abrir bombas', () => {
  const jogo = revelar(novo(), 13, 17);
  assert.equal(obterCasa(jogo, 13, 17).revelada, true);
  assert.equal(obterCasa(jogo, 12, 17).revelada, true);
  for (const [l, c] of minas) assert.equal(obterCasa(jogo, l, c).revelada, false);
});

test('CM06: bandeira bloqueia revelação e pode ser retirada', () => {
  let jogo = alternarBandeira(novo(), 3, 0);
  assert.equal(obterCasa(jogo, 3, 0).bandeira, true);
  jogo = revelar(jogo, 3, 0);
  assert.equal(obterCasa(jogo, 3, 0).revelada, false);
  jogo = alternarBandeira(jogo, 3, 0);
  assert.equal(obterCasa(jogo, 3, 0).bandeira, false);
});

test('CM07: bomba causa derrota e trava a partida', () => {
  let jogo = revelar(novo(), 0, 0);
  assert.equal(obterStatus(jogo), 'perdeu');
  jogo = revelar(jogo, 13, 17);
  assert.equal(obterCasa(jogo, 13, 17).revelada, false);
});

test('CM08: abrir todas as casas seguras basta para vencer', () => {
  let jogo = novo();
  for (let l = 0; l < 14; l++) for (let c = 0; c < 18; c++) {
    if (!obterCasa(jogo, l, c).bomba && obterStatus(jogo) === 'em_andamento') jogo = revelar(jogo, l, c);
  }
  assert.equal(obterStatus(jogo), 'venceu');
});

test('CM09: coordenadas inválidas', () => {
  const jogo = novo();
  assert.throws(() => revelar(jogo, -1, 0), RangeError);
  assert.throws(() => alternarBandeira(jogo, 14, 0), RangeError);
  assert.throws(() => obterCasa(jogo, 0, 18), RangeError);
});
