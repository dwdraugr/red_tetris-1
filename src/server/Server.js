import http from 'http';
import express from 'express';
import * as sockIO from 'socket.io';
import * as events from 'events';
import Game from './game';

class Server {
  constructor() {
    this.port = 5000;
    this.host = '0.0.0.0';

    this.expressServer = express();
    this.httpServer = http.createServer(this.expressServer);
    this.webSocket = sockIO(this.httpServer);

    this.eventEmitter = new events.EventEmitter();
    this.gamesList = {};
  }

  setRoutes() {
    this.webSocket.on('connection', (socket) => {
      socket.on('new game', () => {
        let game = new Game();
        game.addPlayer(new Player());
        const id = game.id;
        Object.assign(this.gamesList, { id: game });

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
        if (this.gamesList.id == null) {
          socket.emit('join game', {
            id,
            message: 'No such game',
            status: 400,
          });
          return;
        }

        // Если игрок уже в игре, вернуть BadRequest
        if (this.gamesList.id.players.id != null) {
          socket.emit('join game', {
            id,
            message: 'Already joined',
            status: 400,
          });
        }

        // Добавить игрока в сессию или сообщить, что комната заполнена
        const success = games[id].addPlayer(new Player(socket));

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
  }

  listenAndServe() {
    this.httpServer.listen(this.port, this.host, () => {
      // eslint-disable-next-line no-console
      console.log(`Listening on ${this.host}:${this.port}`);
    });
  }
}

module.exports = Server;
