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
        tossFlipBy: players[randomIndex],
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

  acceptInvite: async (_parent, { inviteId }, _context) => {
    try {
      // Find the invite and validate it exists
      const invite = await Invite.findById(inviteId);
      if (!invite) {
        return {
          success: false,
          message: "Invite not found",
        };
      }

      // Check if invite is still pending
      if (invite.status !== "PENDING") {
        return {
          success: false,
          message: `Cannot accept invite that is already ${invite.status.toLowerCase()}`,
        };
      }

      // Update the invite status to ACCEPTED
      invite.status = "ACCEPTED";
      await invite.save();

      return {
        success: true,
        message: "Game invite accepted successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to accept invite: ${error.message}`,
      };
    }
  },

  rejectInvite: async (_parent, { inviteId }, _context) => {
    try {
      // Find the invite and validate it exists
      const invite = await Invite.findById(inviteId);
      if (!invite) {
        return {
          success: false,
          message: "Invite not found",
        };
      }

      // Check if invite is still pending
      if (invite.status !== "PENDING") {
        return {
          success: false,
          message: `Cannot reject invite that is already ${invite.status.toLowerCase()}`,
        };
      }

      // Update the invite status to REJECTED
      invite.status = "REJECTED";
      await invite.save();

      return {
        success: true,
        message: "Game invite rejected successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to reject invite: ${error.message}`,
      };
    }
  },
};
