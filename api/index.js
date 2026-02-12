import "dotenv/config";
import mongoose from "mongoose";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import types from "./src/graphql/schema/types.js";
import resolvers from "./src/graphql/resolvers/index.js";
import Clothing from "./src/models/Clothing.js";
import Order from "./src/models/Order.js";
import OrderDataSource from "./src/graphql/data-sources/OrderDataSource.js";
const PORT = Number(process.env.PORT || 3000);
const MONGO_URI = process.env.MONGO_CONNECTION_STRING;

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
    const models = { Clothing, Order };

    return {
      models,
      dataSources: {
        order: new OrderDataSource({ models }),
      },
    };
  },
});

console.log(`Server running on: ${url}`);