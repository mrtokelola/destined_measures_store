import { ApolloServer } from "apollo-server";
import types from "./src/graphql/schema/types.js";
import clothingResolvers from "./src/graphql/resolvers/clothing/index.js";
import mongoose from "mongoose";
import Clothing from "./src/models/Clothing.js"

const MONGO_URI = process.env.MONGO_CONNECTION_STRING;

if (!MONGO_URI) {
  throw new Error("MONGO_CONNECTION_STRING is not set");
}

await mongoose.connect(MONGO_URI);
console.log("MongoDB Connected");

const server = new ApolloServer({
  typeDefs: types,
  resolvers: clothingResolvers,
  context: () => ({
    models: { Clothing },
  }),
});

const { url } = await server.listen(3000);
console.log(`Server started at: ${url}`);