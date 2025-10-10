const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    inviteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invite",
      required: true,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    winPattern: {
      type: String,
      required: function () {
        return !!this.winner;
      },
    },
    isDraw: {
      type: Boolean,
      required: function () {
        return !this.winner;
      },
    },
    gameAbondoned: {
      type: Boolean,
      required: function () {
        return !this.winner && !this.isDraw;
      },
    },
  },
  { timestamps: true }
);

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;
