import kionyxService from "../services/kionyxService.js";

export const kionyxQueryResolvers = {
  getUsers: async (_parent, args, _ctx) => {
    const { email, userId } = args;

    if (!email) {
      console.log(email, "changes in email");
      return {
        success: false,
        data: [],
      };
    }
    try {
      const res = await kionyxService.searchUsers(email);
      console.log(res, "response from kionyx");

      if (!res || res.success === undefined) {
        return {
          success: false,
          data: [],
        };
      }

      // Filter out the current user from the results
      const filteredUsers = res.data.filter((user) => user._id !== userId);

      return {
        success: true,
        data: filteredUsers,
      };
    } catch (err) {
      console.warn(`Failed to call KIONYX service: ${err?.message || err}`);
      return {
        success: false,
        data: [],
      };
    }
  },

  getUsersByIds: async (_parent, { userIds }, _ctx) => {
    try {
      const res = await kionyxService.getUsersByIds(userIds);

      if (!res || res.success === undefined) {
        return {
          success: false,
          data: [],
        };
      }

      return {
        success: true,
        data: res.data || [],
      };
    } catch (error) {
      console.warn(`Failed to get users by IDs: ${error?.message || error}`);
      return {
        success: false,
        data: [],
      };
    }
  },
};
