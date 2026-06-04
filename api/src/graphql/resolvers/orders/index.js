import { createPaymentIntent as createStripePaymentIntent } from "../../../services/paymentService.js";
import { sendOrderReceiptEmail } from "../../../services/emailService.js";

const orderResolvers = {
  Query: {
    orders: async (_parent, _args, { db }) => {
      return db.Order.find().sort({ _id: -1 });
    },

    order: async (_parent, { id }, { db }) => {
      return db.Order.findById(id);
    },
  },

  Mutation: {
    createOrder: async (_parent, { customer, items, total }, { db, ordersQueue }) => {
      const order = await db.Order.create({ customer, items, total });

      await sendOrderReceiptEmail({ order });

      await ordersQueue.add("decreaseInventory", {
        orderId: order.id,
          items: items.map((item) => ({
            productId: item.productId,
            size: item.size,
            quantity: item.quantity,
          }))
      });

      return order;
    },

    deleteOrder: async (_parent, { id }, { db }) => {
      return db.Order.findByIdAndDelete(id);
    },

    createPaymentIntent: async (_parent, { amount, items }, { db }) => {
      try {
        for (const item of items) {
          const product = await db.Clothing.findById(item.productId);

          if (!product) {
            throw new Error(`Product not found: ${item.productId}`);
          }

          const variant = product.variants.find(
            (variant) => variant.size === item.size
          );

          if (!variant) {
            throw new Error(`Size ${item.size} not found for ${product.name}`);
          }

          if (variant.quantity < item.quantity) {
            throw new Error(
              `Not enough stock for ${product.name} size ${item.size}. Available: ${variant.quantity}`
            );
          }
        }

        const paymentIntent = await createStripePaymentIntent(amount);

        return {
          clientSecret: paymentIntent.client_secret,
        };
      } catch (err) {
        console.error("Stripe/createPaymentIntent error:", err);

        throw new Error(
          err?.raw?.message ||
          err?.message ||
          "Stripe createPaymentIntent failed",
        );
      }
    },
  },
};

export default orderResolvers;