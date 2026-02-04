import { getClothingById, listClothes, getClothesFilters } from "../../../services/clothingService.js";
import { createPaymentIntent } from "../../../services/paymentService.js";

const index = {
  Query: {
    clothing: async (_parent, { id }, { models }) => {
      return getClothingById(id, models.Clothing);
    },

    clothes: async (_parent, { page = 1, limit = 6, sort, filter }, { models }) => {
      return listClothes(models.Clothing, { page, limit, sort, filter });
    },

    clothesFilters: async (_parent, _args, { models }) => {
      return getClothesFilters(models.Clothing);
    },

    orders: async (_parent, _args, { models }) => {
      return models.Order.find().sort({ _id: -1 });
    },

  },

  Mutation: {
    createClothing: async (_parent, args, { models }) => {
      return models.Clothing.create(args);
    },

    createOrder: async (_parent, { customer, items, total }, { models }) => {
      const { Order } = models;
      const order = await Order.create({ customer, items, total });
      return order;
    },

    decreaseInventory: async (_parent, args, { models }) => {
      const { productId, size, quantity } = args;
      const { Clothing } = models;
      const clothing = await Clothing.findById(productId);
      const variant = clothing.variants.find((variant) => variant.size === size);

      variant.quantity -= quantity;
      clothing.inStock = clothing.variants.some((variant) => variant.quantity > 0);

      await clothing.save();

      return {
        size: variant.size,
        quantity: variant.quantity,
      };
    },

    increaseInventory: async (_parent, args, { models }) => {
      const { productId, size, quantity } = args;
      const { Clothing } = models;
      const clothing = await Clothing.findById(productId);
      const variant = clothing.variants.find((variant) => variant.size === size);

      variant.quantity += quantity;
      clothing.inStock = clothing.variants.some((variant) => variant.quantity > 0);

      await clothing.save();

      return {
        size: variant.size,
        quantity: variant.quantity,
      };
    },

    createPaymentIntent: async (_parent, { amount }, _ctx) => {
      const paymentIntent = await createPaymentIntent(amount);

      return {
        clientSecret: paymentIntent.client_secret,
      };
    },
  },
};

export default index;