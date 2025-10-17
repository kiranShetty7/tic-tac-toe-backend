import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
  },
  { timestamps: true }
);

// expireAfterSeconds = 300 seconds = 5 minutes
inviteSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

const Invite = mongoose.model("Invite", inviteSchema);
export default Invite;
