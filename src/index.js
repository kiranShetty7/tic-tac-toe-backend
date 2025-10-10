import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { WebSocketServer } from "ws";
// Use the package's exported subpath (matches package.json "exports")
import { useServer } from "graphql-ws/use/ws";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const PORT = parseInt(process.env.PORT, 10) || 4000;
const WS_PORT = parseInt(process.env.WS_PORT, 10) || PORT + 1;

async function startServer() {
  // 0️⃣ Connect to MongoDB (if URI provided)
  const mongoUri = process.env.MONGO_DB_URI;
  const mongoDbName = process.env.MONGO_DB_NAME;
  if (mongoUri) {
    try {
      // optional strictQuery setting to avoid deprecation warnings
      mongoose.set("strictQuery", false);
      const connectOptions = {};
      if (mongoDbName) connectOptions.dbName = mongoDbName;
      await mongoose.connect(mongoUri, connectOptions);
      console.log("✅ Connected to MongoDB");
    } catch (err) {
      console.error("❌ Failed to connect to MongoDB:", err.message || err);
      // Exit early: app likely depends on DB
      process.exit(1);
    }
  } else {
    console.warn(
      "⚠️  No MongoDB URI provided in env (MONGO_DB_URI). Skipping DB connection."
    );
  }

  // Load schema after DB connection so models can be registered inside resolvers
  const { schema } = await import("./schema.js");

  // 1️⃣ Create Apollo Server
  const server = new ApolloServer({ schema });

  // 2️⃣ Start HTTP server for queries & mutations
  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT },
    context: async ({ req }) => {
      // Example: extract auth token
      const token = req.headers.authorization || "";
      // You can validate JWT here and add user info
      return { token };
    },
  });

  console.log(`🚀 HTTP Server ready at ${url}`);
  console.log(`🚀 Subscriptions will run at ws://localhost:${WS_PORT}/graphql`);

  // 3️⃣ Create WebSocket server for GraphQL subscriptions
  const wsServer = new WebSocketServer({
    port: WS_PORT, // run WS on configured WS_PORT (optional)
    path: "/graphql", // match GraphQL endpoint path
  });

  // Attach GraphQL schema to WS server
  useServer(
    {
      schema,
      context: async (ctx) => {
        // ctx.connectionParams can contain auth token from client
        const token = ctx.connectionParams?.authorization || "";
        return { token };
      },
    },
    wsServer
  );

  console.log(`🚀 WebSocket Server ready at ws://localhost:${WS_PORT}/graphql`);
}

startServer();
