import { kionyxQueryResolvers as kionyxResolvers } from "../resolvers/kionyxResolvers.js";
import { ticTacToeQueryResolvers } from "../resolvers/ticTacToeQueries.js";

export const queryResolvers = {
  ...kionyxResolvers,
  ...ticTacToeQueryResolvers,
};
