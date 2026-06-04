import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    name: { type: String },
    price: { type: Number },
    size: { type: String },
    color: { type: String },
    quantity: { type: Number },
  }
);

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String },
      email: { type: String },
    },
    items: [orderItemSchema],
    total: { type: Number },
  }
)

export const Order = mongoose.model("Order", orderSchema);
export default Order;