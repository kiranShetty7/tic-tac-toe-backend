export const mutationResolvers = {
  makeMove: (_, { x, y }) => {
    console.log(`Move at position (${x}, ${y})`);
    // TODO: publish move to subscription
    return `Move registered at (${x}, ${y})`;
  },
};
