import Invite from "../mongooseModels/inviteModel.js";
import kionyxService from "../services/kionyxService.js";

export const ticTacToeQueryResolvers = {
  getSentInvites: async (_parent, { userId }, _context) => {
    try {
      console.log("Fetching sent invites for userId:", userId);
      // Get invites where the specified user is the sender
      const invites = await Invite.find({
        from: userId.toString(),
        status: "PENDING",
      }).sort({
        createdAt: -1,
      });
      console.log("Found invites:", invites);

      // Get unique recipient IDs
      const recipientIds = [
        ...new Set(invites.map((invite) => invite.to.toString())),
      ];

      // Fetch recipient details
      const recipientsResponse = await kionyxService.getUsersByIds(
        recipientIds
      );
      const recipientsMap = recipientsResponse.success
        ? recipientsResponse.data.reduce((map, user) => {
            map[user._id] = user;
            return map;
          }, {})
        : {};

      return {
        success: true,
        message: "Sent invites fetched successfully",
        invites: invites.map((invite) => ({
          _id: invite._id.toString(),
          from: invite.from.toString(),
          to: {
            _id: invite.to.toString(),
            name: recipientsMap[invite.to.toString()]?.name || "",
            email:
              recipientsMap[invite.to.toString()]?.email || "unknown@email.com",
          },
          gameId: invite.gameId.toString(),
        })),
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to fetch sent invites: ${error.message}`,
        invites: [],
      };
    }
  },

  getReceivedInvites: async (_parent, { userId }, _context) => {
    try {
      // Get invites where the specified user is the recipient
      const invites = await Invite.find({
        to: userId,
        status: "PENDING",
      }).sort({ createdAt: -1 });

      // Get unique sender IDs
      const senderIds = [
        ...new Set(invites.map((invite) => invite.from.toString())),
      ];

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
            email: sendersMap[invite.from.toString()]?.email || "",
          },
          to: userId,
          gameId: invite.gameId.toString(),
        })),
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to fetch received invites: ${error.message}`,
        invites: [], // Always return an empty array instead of undefined
      };
    }
  },
};
