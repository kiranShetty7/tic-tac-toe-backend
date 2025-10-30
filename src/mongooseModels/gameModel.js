import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    tossFlipBy: { type: String },
    tossWinner: { type: String },
    playerX: { type: String },
    playerO: { type: String },
    previousMove: { type: String },
    winner: {
      type: String,
      default: null,
    },
    winPattern: {
      type: String,
    },
    boardState: {
      type: [String],
      validate: {
        validator: function (arr) {
          return (
            arr &&
            arr.length === 9 &&
            arr.every((val) => val === "X" || val === "O" || val === "")
          );
        },
        message:
          "Board must have exactly 9 positions and contain only X, O, or empty values",
      },
      default: Array(9).fill(""),
      required: true,
    },
    isDraw: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Game = mongoose.model("Game", gameSchema);
export default Game;
