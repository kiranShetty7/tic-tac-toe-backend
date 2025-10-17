import Invite from "../mongooseModels/inviteModel.js";
import kionyxService from "../services/kionyxService.js";

export const ticTacToeQueryResolvers = {
  getSentInvites: async (_parent, { userId }, _context) => {
    try {
      // Get invites where the specified user is the sender
      const invites = await Invite.find({
        from: userId,
      }).sort({ createdAt: -1 });

      // Get unique user IDs from only the 'to' field (recipients)
      const recipientIds = new Set();
      invites.forEach((invite) => {
        recipientIds.add(invite.to.toString());
      });

      return {
        success: true,
        message: "Sent invites fetched successfully",
        invites: invites.map((invite) => ({
          _id: invite._id.toString(),
          from: userId, // Just send the ID for sent invites
          to: invite.to.toString(),
          gameId: invite.gameId.toString(),
        })),
        users: Array.from(recipientIds), // This contains only the recipient IDs
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to fetch sent invites: ${error.message}`,
        invites: [],
        users: [],
      };
    }
  },

  getReceivedInvites: async (_parent, { userId }, _context) => {
    try {
      // Get invites where the specified user is the recipient
      const invites = await Invite.find({
        to: userId,
      }).sort({ createdAt: -1 });

      // Get unique sender IDs
      const senderIds = [
        ...new Set(invites.map((invite) => invite.from.toString())),
      ];
      console.log(senderIds, "sender ids");
      // Fetch sender details
      const sendersResponse = await kionyxService.getUsersByIds(senderIds);
      const sendersMap = sendersResponse.success
        ? sendersResponse.data.reduce((map, user) => {
            map[user._id] = user;
            return map;
          }, {})
        : {};

      return {
        success: true,
        message: "Received invites fetched successfully",
        invites: invites.map((invite) => ({
          _id: invite._id.toString(),
          from: {
            _id: invite.from.toString(),
            name: sendersMap[invite.from.toString()]?.name || "",
            email: sendersMap[invite.from.toString()]?.email,
          },
          to: invite.to.toString(),
          gameId: invite.gameId.toString(),
        })),
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to fetch received invites: ${error.message}`,
        invites: [],
      };
    }
  },
};
