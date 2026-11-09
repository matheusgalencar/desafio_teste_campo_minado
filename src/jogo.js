const dentro = (jogo, l, c) => Number.isInteger(l) && Number.isInteger(c) && l >= 0 && l < jogo.linhas && c >= 0 && c < jogo.colunas;
const chave = (l, c) => `${l},${c}`;

function criarJogo({ linhas = 14, colunas = 18, bombas = 40, posicoesBombas } = {}) {
  if (![linhas, colunas, bombas].every(Number.isInteger) || linhas <= 0 || colunas <= 0 || bombas < 0 || bombas >= linhas * colunas) throw new RangeError('Dimensões ou quantidade de bombas inválidas');
  if (posicoesBombas === undefined) {
    posicoesBombas = [];
    const usadas = new Set();
    while (posicoesBombas.length < bombas) {
      const l = Math.floor(Math.random() * linhas), c = Math.floor(Math.random() * colunas);
      if (!usadas.has(chave(l, c))) { usadas.add(chave(l, c)); posicoesBombas.push([l, c]); }
    }
  }
  if (!Array.isArray(posicoesBombas) || posicoesBombas.length !== bombas) throw new RangeError('Quantidade de posições inválida');
  const jogo = { linhas, colunas, bombas, status: 'em_andamento', reveladasSeguras: 0, casas: Array.from({ length: linhas }, () => Array.from({ length: colunas }, () => ({ revelada: false, bandeira: false, bombasVizinhas: 0, bomba: false }))) };
  const usadas = new Set();
  for (const pos of posicoesBombas) {
    if (!Array.isArray(pos) || pos.length !== 2 || !dentro(jogo, pos[0], pos[1]) || usadas.has(chave(...pos))) throw new RangeError('Posição de bomba inválida ou repetida');
    usadas.add(chave(...pos)); jogo.casas[pos[0]][pos[1]].bomba = true;
  }
  for (let l = 0; l < linhas; l++) for (let c = 0; c < colunas; c++) {
    for (let dl = -1; dl <= 1; dl++) for (let dc = -1; dc <= 1; dc++) {
      if ((dl || dc) && dentro(jogo, l + dl, c + dc) && jogo.casas[l + dl][c + dc].bomba) jogo.casas[l][c].bombasVizinhas++;
    }
  }
  return jogo;
}

function verificar(jogo, l, c) { if (!dentro(jogo, l, c)) throw new RangeError('Coordenada inválida'); }
function obterCasa(jogo, l, c) { verificar(jogo, l, c); return { ...jogo.casas[l][c] }; }
function obterStatus(jogo) { return jogo.status; }

function alternarBandeira(jogo, l, c) {
  verificar(jogo, l, c);
  const casa = jogo.casas[l][c];
  if (jogo.status === 'em_andamento' && !casa.revelada) casa.bandeira = !casa.bandeira;
  return jogo;
}

function revelar(jogo, l, c) {
  verificar(jogo, l, c);
  if (jogo.status !== 'em_andamento') return jogo;
  const inicio = jogo.casas[l][c];
  if (inicio.revelada || inicio.bandeira) return jogo;
  if (inicio.bomba) { inicio.revelada = true; jogo.status = 'perdeu'; return jogo; }
  const fila = [[l, c]], visitadas = new Set();
  while (fila.length) {
    const [r, s] = fila.pop(), id = chave(r, s);
    if (visitadas.has(id)) continue;
    visitadas.add(id);
    const casa = jogo.casas[r][s];
    if (casa.revelada || casa.bandeira || casa.bomba) continue;
    casa.revelada = true; jogo.reveladasSeguras++;
    if (casa.bombasVizinhas === 0) {
      for (let dr = -1; dr <= 1; dr++) for (let ds = -1; ds <= 1; ds++) if (dentro(jogo, r + dr, s + ds)) fila.push([r + dr, s + ds]);
    }
  }
  if (jogo.reveladasSeguras === jogo.linhas * jogo.colunas - jogo.bombas) jogo.status = 'venceu';
  return jogo;
}

module.exports = { criarJogo, revelar, alternarBandeira, obterCasa, obterStatus };
