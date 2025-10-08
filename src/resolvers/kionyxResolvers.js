import axios from "axios";

export const kionyxResolvers = {
  getUsersByQuery: async (_parent, args, _ctx) => {
    const email = args?.email;

    const base = process.env.KIONYX_BACKEND_SERVICE;

    const url = `${base.replace(/\/$/, "")}/users/user`;

    try {
      const res = await axios.post(
        url,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      return res.data || [];
    } catch (err) {
      console.warn(`Failed to call KIONYX service: ${err}`);
      return [];
    }
  },
};
