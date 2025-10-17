import fs from "fs";
import path from "path";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { queryResolvers } from "./graphql/queries.js";
import { mutationResolvers } from "./graphql/mutations.js";
import { subscriptionResolvers } from "./graphql/subscriptions.js";

// Read the schema.graphql file from the same directory (adjust path if needed)
const schemaPath = path.resolve("./src/graphql/schema/schema.graphql");
const typeDefs = fs.readFileSync(schemaPath, { encoding: "utf-8" });

// Create executable schema
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    Query: queryResolvers,
    Mutation: mutationResolvers,
    Subscription: subscriptionResolvers,
  },
});
