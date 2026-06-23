const releaseReservedInventoryResolvers = {
  Mutation: {
    releaseReservedInventory: async (_parent, args, { db }) => {
      const { productId, size, quantity } = args;
      const { Clothing } = db;

      const clothing = await Clothing.findById(productId);

      const variant = clothing.variants.find((v) => v.size === size);

      if (!variant) {
        throw new Error("Variant not found");
      }

      variant.reservedQuantity = Math.max(
        variant.reservedQuantity - quantity,
        0
      );

      await clothing.save();

      return {
        size: variant.size,
        quantity: variant.quantity,
        reservedQuantity: variant.reservedQuantity,
      };
    },
  },
};

export default releaseReservedInventoryResolvers;