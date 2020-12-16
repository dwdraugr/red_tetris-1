const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
});

// Классы
const Game = require('./game.js');
const Player = require('./player.js');
// const Piece = require('./piece.js');

// Не придумал ничего лучше, кроме как держать словарь/карту всех текущих игр
const games = {};

io.on('connection', (socket) => {
  /**
   * Создание новой игры
   */
  socket.on('new game', () => {
    const id = `game#${socket.id}`;

    // Если не закрыта предыдущая сессия, вернуть Bad Request
    if (games[id]) {
      socket.emit('new game', {
        message: 'Previous session not closed',
        status: 400,
      });
      return;
    }

    // Создать игру
    const game = new Game();
    games[id] = game;

    // Создать нового игрока
    const player = new Player();
    game.addPlayer(player);

    // Добавить игрока в текущую игру
  });

  /**
   * Присоединение к игре
   */
  socket.on('join game', (message) => {
    const { id } = message;

    // Если игры с таким id не существует, не пускать и вернуть Bad Request
    if (!games[id]) {
      socket.emit('join game', {
        message: 'No such game',
        status: 400,
      });
      return;
    }

    // Если игрок уже в игре, вернуть BadRequest
    if (socket.rooms[id]) {
      socket.emit('join game', {
        message: 'Already joined',
        status: 400,
      });
    }

    // Создать игрока
    // Добавить игрока в текущую игру
  });

  /**
   * Вернуть список доступных игр
   */
  socket.on('list games', () => {
    socket.emit('list games', {
      games: Object.keys(games),
    });
  });
});

http.listen(5000);
