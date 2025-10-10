const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    isExpired: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// expireAfterSeconds = 300 seconds = 5 minutes
inviteSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

const Invite = mongoose.model("Invite", inviteSchema);
module.exports = Invite;
