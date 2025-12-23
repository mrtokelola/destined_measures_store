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

export default Clothing;