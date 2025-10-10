import fs from "fs";
import path from "path";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { kionyxQueryResolvers } from "./graphql/queries.js";
import { ticTacToeMutationResolvers } from "./graphql/mutations.js";
import { subscriptionResolvers } from "./graphql/subscriptions.js";

// Read the schema.graphql file from the same directory (adjust path if needed)
const schemaPath = path.resolve("./src/graphql/schema/schema.graphql");
const typeDefs = fs.readFileSync(schemaPath, { encoding: "utf-8" });

// Create executable schema
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    Query: kionyxQueryResolvers,
    Mutation: ticTacToeMutationResolvers,
    Subscription: subscriptionResolvers,
  },
});
