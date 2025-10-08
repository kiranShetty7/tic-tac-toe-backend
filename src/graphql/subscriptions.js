export const subscriptionResolvers = {
  moveMade: {
    subscribe: async function* () {
      while (true) {
        yield { moveMade: new Date().toISOString() };
        await new Promise((res) => setTimeout(res, 1000));
      }
    },
  },
};
