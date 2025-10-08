import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "./typedefs.js";
import { queryResolvers } from "./graphql/queries.js";
import { mutationResolvers } from "./graphql/mutations.js";
import { subscriptionResolvers } from "./graphql/subscriptions.js";

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    Query: queryResolvers,
    Mutation: mutationResolvers,
    Subscription: subscriptionResolvers,
  },
});
