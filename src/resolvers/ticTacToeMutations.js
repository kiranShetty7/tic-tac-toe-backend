import Invite from "../mongooseModels/inviteModel.js";
import Game from "../mongooseModels/gameModel.js";

export const ticTacToeMutationResolvers = {
  sendInvite: async (_parent, { input }, _context) => {
    try {
      const { fromUserId, toUserId } = input;

      // Prevent self-invites
      if (fromUserId === toUserId) {
        return {
          success: false,
          message: "You cannot send an invite to yourself",
        };
      }

      // Check for existing non-expired invites between these users (in either direction)
      const existingInvite = await Invite.findOne({
        isExpired: false,
        $or: [
          // Check if fromUser has invited toUser
          { from: fromUserId, to: toUserId },
          // Check if toUser has invited fromUser
          { from: toUserId, to: fromUserId },
        ],
      });

      if (existingInvite) {
        return {
          success: false,
          message: "An active invite already exists between these players",
          invite: {
            _id: existingInvite._id.toString(),
            from: existingInvite.from.toString(),
            to: existingInvite.to.toString(),
            gameId: existingInvite.gameId.toString(),
          },
        };
      }

      const players = [fromUserId, toUserId];
      const randomIndex = Math.random() > 0.5 ? 0 : 1;
      // Create a new game
      const game = new Game({
        playerX: players[randomIndex],
        playerO: players[randomIndex === 0 ? 1 : 0],
      });
      await game.save();

      // Create the invite with the new game's ID
      const invite = new Invite({
        from: fromUserId,
        to: toUserId,
        gameId: game._id,
      });

      await invite.save();

      return {
        success: true,
        message: "Game created and invite sent successfully",
        invite: {
          _id: invite._id.toString(),
          from: invite.from.toString(),
          to: invite.to.toString(),
          gameId: invite.gameId.toString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to send invite: ${error.message}`,
      };
    }
  },
};
