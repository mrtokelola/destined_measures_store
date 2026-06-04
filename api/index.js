import "dotenv/config";
import mongoose from "mongoose";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import types from "./src/graphql/schema/types.js";
import resolvers from "./src/graphql/resolvers/index.js";
import db from "./src/models/index.js";
import OrderDataSource from "./src/graphql/data-sources/OrderDataSource.js";
const PORT = Number(process.env.PORT || 3000);
const MONGO_URI = process.env.MONGO_CONNECTION_STRING;
import { Queue } from "bullmq";

const ordersQueue = new Queue("orders", {
  connection: {
    host: process.env.REDIS_HOST ?? "127.0.0.1",
    port: Number(process.env.REDIS_PORT ?? 6379),
  },
});

if (!MONGO_URI) {
  throw new Error("MONGO_CONNECTION_STRING is not set");
}

await mongoose.connect(MONGO_URI);
console.log("MongoDB Connected");

const server = new ApolloServer({
  typeDefs: types,
  resolvers,
  introspection: true,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: PORT },
  context: async () => {

    return {
      db,
      ordersQueue,
      dataSources: {
        order: new OrderDataSource({ db }),
      },
    };
  },
});

console.log(`Server running on: ${url}`);