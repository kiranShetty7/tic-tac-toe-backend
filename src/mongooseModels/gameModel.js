import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    winPattern: {
      type: String,
    },
    isDraw: {
      type: Boolean,
      required: function () {
        return !this.winner && this.status === "COMPLETED";
      },
    },
    status: {
      type: String,
      enum: ["NOT_STARTED", "COMPLETED", "ABANDONED"],
      default: "NOT_STARTED",
    },
  },
  { timestamps: true }
);

const Game = mongoose.model("Game", gameSchema);
export default Game;
