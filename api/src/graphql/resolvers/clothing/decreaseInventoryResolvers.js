const decreaseInventoryResolvers = {
  Mutation: {
    decreaseInventory: async (_parent, args, { db }) => {
      const { productId, size, quantity } = args;
      const { Clothing } = db;

      const clothing = await Clothing.findById(productId);

      const variant = clothing.variants.find((v) => v.size === size);

      if (!variant) {
        const availableSizes = clothing.variants
          .map((v) => v.size)
          .join(", ");

        throw new Error(
          `Size ${size} not found. Available sizes: ${availableSizes}`
        );
      }

      variant.quantity = Math.max(
        variant.quantity - quantity,
        0
      );

      clothing.inStock = clothing.variants.some(
        (v) => v.quantity > 0
      );

      await clothing.save();

      return {
        size: variant.size,
        quantity: variant.quantity,
        inStock: clothing.inStock,
      };
    },
  },
};

export default decreaseInventoryResolvers;