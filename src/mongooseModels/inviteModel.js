import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    gameId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// expireAfterSeconds = 300 seconds = 5 minutes
inviteSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

const Invite = mongoose.model("Invite", inviteSchema);
export default Invite;
