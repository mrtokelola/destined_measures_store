import { ApolloServer } from "apollo-server";
import types from "./schema/types.js";
import resolvers from "./schema/resolvers.js";
import mongoose from "mongoose";

const clothingSchema = new mongoose.Schema(
  {
    name: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    inStock: { type: Boolean, default: true },
    imageUrl: { type: String },
    color: { type: String },
    variants: [
      {
        size: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
  { collection: "clothing" }
);

export const Clothing = mongoose.model("Clothing", clothingSchema);

await mongoose.connect("mongodb://localhost/destined_measures");
console.log("MongoDB Connected");

const server = new ApolloServer({
  typeDefs: types,
  resolvers,
  context: () => ({
    models: { Clothing },
  }),
});

const { url } = await server.listen(3000);
console.log(`Server started at: ${url}`);