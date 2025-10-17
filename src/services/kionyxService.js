import axios from "axios";

class KionyxService {
  constructor() {
    this.baseUrl = process.env.KIONYX_BACKEND_SERVICE + process.env.VERSION;
  }

  async getUsersByIds(userIds) {
    try {
      const url = `${this.baseUrl}/user/users/by-ids`;
      const response = await axios.post(
        url,
        {
          userIds: userIds,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(`Failed to fetch users by IDs: ${error?.message || error}`);
      return {
        success: false,
        data: [],
        message: `Failed to fetch users: ${error?.message || "Unknown error"}`,
      };
    }
  }

  async searchUsers(email) {
    try {
      const url = `${this.baseUrl}/user/users`;
      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
        params: { email },
      });

      return response.data;
    } catch (error) {
      console.error(`Failed to search users: ${error?.message || error}`);
      return {
        success: false,
        data: [],
        message: `Failed to search users: ${error?.message || "Unknown error"}`,
      };
    }
  }
}

const kionyxService = new KionyxService();

export default kionyxService;
