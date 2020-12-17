class Game {
  constructor(io, id, playerLimit = 1) {
    this.io = io;
    this.id = id;
    this.playerLimit = playerLimit;
    this.players = [];

    this.isActive = true; // Статус игры
    this.timeoutBeforeTermination = setTimeout(() => {
      this.timeoutBeforeTermination = null;
    }, 1000 * 60); // минутный таймаут, который держит сессию открытой, даже если нет игроков
  }

  nextTick() {
    // Здесь нужно прописать кучу условий, при которых игру нужно закрывать
    // Не закончено!
    // if (!this.isActive && !this.timeoutBeforeTermination && !this.players.length) {
    //   this.endSession();
    //   return;
    // }

    this.players.forEach((player) => {
      if (player.isActive) {
        // player.movePieceDown();
      }
    });

    const currentState = {};
    this.players.forEach((player) => { currentState[player.socket.id] = player.field; });

    this.io.volatile.in(this.id).emit('current state', currentState);
  }

  addPlayer(player) {
    if (this.players.length === this.playerLimit) {
      return false;
    }
    player.socket.join(this.id);
    this.players.push(player);
    return true;
  }

  endSession() {
    this.players.forEach((player) => {
      player.to(this.id).emit('session closed', {
        id: this.id,
        message: 'Game session closed',
        status: 200,
      });
      player.socket.leave(this.id);
    });
    this.isActive = false;
  }
}

module.exports = Game;
