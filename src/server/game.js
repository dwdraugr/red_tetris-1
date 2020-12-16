class Game {
  constructor(id) {
    this.id = id;

    this.field = {};
    this.players = [];
    this.winner = undefined;
  }

  addPlayer(player) {
    this.players = this.players.push(player);
  }

  // getHighestScore() {}
  // terminateGame() {}
}

module.exports = Game;
