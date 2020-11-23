var matriz = [];
var game = {};
var player = 0;
const hudPlayer = document.querySelector('.hud-player');
const btnReset = document.querySelector('.btn-restart');
const menu = document.getElementById('menu');
var hits = 0;
var vencedor = null;

function start() {
  menu.classList.add('game-started');

  game = newGame();
  gerarTabulerio(game.matriz);
}

function restart() {
  hudPlayer.innerHTML = 'Player: O';
  hits = 0;
  player = 0;
  vencedor = null;
  btnReset.classList.remove('show');
  tabuleiro.innerHTML = '';
  game = newGame();
  gerarTabulerio(game.matriz);
}

function newGame() {
  matriz = gerarMatriz();
  
  return {
    player1: 1, // 1 representa x
    player2: 0, // 0 representa 0 (bolinha)
    matriz
  };
}

function gerarMatriz() {
  let matriz = [];

  let contador = 1;
  for (let i = 0; i < 3; i++) {
    matriz[i] = [];
    for (let j = 0; j < 3; j++) {
      matriz[i][j] = {
        id: contador,
        player: null,
        value: 0
      };

      contador++;
    }
  }

  return matriz;
}

function gerarTabulerio(matriz) {
  let game = document.querySelector('#game');
  let tabuleiro = document.querySelector('#tabuleiro');
  
  for (let i = 0; i < 3; i++) {
    let linha = gerarLinha(i);
    for (let j = 0; j < 3; j++) {
      linha.appendChild(gerarColuna(matriz[i][j]));
    }

    tabuleiro.appendChild(linha);
    game.classList.add('started');
  }
}

function gerarLinha(n) {
  let div = document.createElement('div');
  div.classList = 'linha';
  div.dataset.linha = n;
  return div;
}

function gerarColuna(coluna) {
  let div = document.createElement('button');
  div.classList = 'coluna';
  div.dataset.id = coluna.id;
  div.addEventListener('click', function() {
    marcar(coluna.id, div);
  });
  return div;
}

function marcar(id, div) {
  if (vencedor !== null) return;

  if (hits === 0) {
    btnReset.classList.add('show');
  }

  if (!(div.classList.contains('marcado'))) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (matriz[i][j].id === id) {
          div.classList.add('marcado');
          matriz[i][j].player = player;
          matriz[i][j].value = 1;
          if (player) {
            div.innerHTML = 'X';
            player = 0;
            hudPlayer.innerHTML = "Player: O";
          } else {
            div.innerHTML = 'O';
            player = 1;
            hudPlayer.innerHTML = "Player: X";
          }

          hits++;
          verificarVencedor();
        }
      }
    }
  }
}

function verificarVencedor() {
  if (hits >= 5) {
    verificarDiagonais();
    verificarVerticais();
    verificarHorizontais();
  }

  if (vencedor !== null) {
    if (player) {
      hudPlayer.innerHTML = "O Venceu!";
    } else {
      hudPlayer.innerHTML = "X Venceu!";
    }
  }
} 

function verificarDiagonais() {
  // diagonal esquerda-direita
  if (
    matriz[0][0].player === matriz[1][1].player &&
    matriz[0][0].player === matriz[2][2].player
  ) {
    vencedor = matriz[0][0].player
  } else if (
    matriz[0][2].player === matriz[1][1].player &&
    matriz[0][2].player === matriz[2][0].player
  ) {
    // diagonal direita-esquerda
    vencedor = matriz[0][2].player
  }
}

function verificarVerticais() {
  for (let i = 0; i < 3; i++) {
    if (matriz[0][i].player === null) continue;
      
    if (
      matriz[0][i].player === matriz[1][i].player &&
      matriz[0][i].player === matriz[2][i].player &&
      matriz[1][i].player === matriz[2][i].player
    ) {
      vencedor = matriz[0][i].player;
    }
  }
}

function verificarHorizontais() {
  for (let i = 0; i < 3; i++) {
    let oks = 0;
    let player = null;

    for (let j = 0; j < 3; j++) {
      if (player === null && matriz[i][j].player !== null) player = matriz[i][j].player;
      if (player === null) continue;
      if (matriz[i][j].player === player) oks++;
    }

    if (oks === 3) {
      vencedor = player;
    }
  }
}