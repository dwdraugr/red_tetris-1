const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
});
const EventEmitter = require('events');

// Классы
const Game = require('./game.js');
const Player = require('./player.js');
// const Piece = require('./piece.js');

// Словарь/карта всех текущих игр
const games = {};

// Глобальный генератор событий
const eventEmitter = new EventEmitter();

io.on('connection', (socket) => {
  /**
   * Создание новой игры
   */
  socket.on('new game', () => {
    const id = `game#${socket.id}`;

    // Если не закрыта предыдущая сессия, вернуть BadRequest
    if (games[id]) {
      socket.emit('new game', {
        id,
        message: 'Previous session not closed',
        status: 400,
      });
      return;
    }

    // Создать сессию и добавить в карту игр
    games[id] = new Game(io, id);

    // Сообщить об успешном создании игры
    socket.emit('new game', {
      id,
      message: 'Game session created successfully',
      status: 200,
    });
  });

  /**
   * Присоединение к игре
   */
  socket.on('join game', (message) => {
    const { id } = message;

    // Если игры с таким id не существует, вернуть BadRequest
    if (!games[id]) {
      socket.emit('join game', {
        id,
        message: 'No such game',
        status: 400,
      });
      return;
    }

    // Если игрок уже в игре, вернуть BadRequest
    if (socket.rooms[id]) {
      socket.emit('join game', {
        id,
        message: 'Already joined',
        status: 400,
      });
    }

    // Добавить игрока в сессию или сообщить, что комната заполнена
    const success = games[id].addPlayer(new Player(socket));
    if (!success) {
      socket.emit('join game', {
        id,
        message: 'Room full',
        status: 400,
      });
    }

    // Сообщить об успешном входе
    socket.emit('join game', {
      id,
      message: 'Joined game session successfully',
      status: 200,
    });
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

// Каждый nextTick:
//   1. Делаем следующий ход в каждой игре
//   2. Удаляем законченные сессии
eventEmitter.on('nextTick', () => {
  Object.values(games).forEach((game) => {
    game.nextTick();
    if (!game.isActive) {
      delete games[game.id];
    }
  });
});

// Генератор тиков
setInterval(() => {
  eventEmitter.emit('nextTick');
}, 1000);

http.listen(5000);
