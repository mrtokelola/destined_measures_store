const reserveInventoryResolvers = {
  Mutation: {
    reserveInventory: async (_parent, args, { db }) => {
      const { productId, size, quantity } = args;
      const { Clothing } = db;

      const clothing = await Clothing.findById(productId);

      const variant = clothing.variants.find((v) => v.size === size);

      if (!variant) {
        throw new Error("Variant not found");
      }

      const availableQuantity =
        variant.quantity - variant.reservedQuantity;

      if (availableQuantity < quantity) {
        throw new Error("Not enough inventory available");
      }

      variant.reservedQuantity += quantity;

      await clothing.save();

      return {
        size: variant.size,
        quantity: variant.quantity,
        reservedQuantity: variant.reservedQuantity,
      };
    },
  },
};

export default reserveInventoryResolvers;