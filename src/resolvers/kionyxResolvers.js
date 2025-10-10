import axios from "axios";

export const kionyxQueryResolvers = {
  getUsers: async (_parent, args, _ctx) => {
    const email = args?.email;

    if (!email) {
      return {
        success: false,
        data: [],
      };
    }

    const base = process.env.KIONYX_BACKEND_SERVICE + process.env.VERSION;
    const url = `${base}/user/users`;

    console.log("Kionyx URL:", url);

    try {
      const res = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
        params: { email },
      });

      // Return the exact API response structure
      return res.data;
    } catch (err) {
      console.warn(`Failed to call KIONYX service: ${err?.message || err}`);
      return {
        success: false,
        data: [],
      };
    }
  },
};
