import { ApolloServer } from "apollo-server";
import types from "./src/graphql/schema/types.js";
import resolvers from "./src/graphql/resolvers/index.js";
import mongoose from "mongoose";
import Clothing from "./src/models/Clothing.js";
import Order from "./src/models/Order.js";
import OrderDataSource from "./src/graphql/data-sources/OrderDataSource.js";

const MONGO_URI = process.env.MONGO_CONNECTION_STRING;

if (!MONGO_URI) {
  throw new Error("MONGO_CONNECTION_STRING is not set");
}

await mongoose.connect(MONGO_URI);
console.log("MongoDB Connected");

const server = new ApolloServer({
  typeDefs: types,
  resolvers,
  playground: true,
  introspection: true,
  context: () => {
    const models = { Clothing, Order };

    return {
      models,
      dataSources: {
        order: new OrderDataSource({ models }),
      },
    };
  },
});

const { url } = await server.listen(3000);
console.log(`Server started at: ${url}`);