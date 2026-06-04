const increaseInventoryResolvers = {
  Mutation: {
    increaseInventory: async (_parent, args, { db }) => {
      const { productId, size, quantity } = args;
      const { Clothing } = db;
      const clothing = await Clothing.findById(productId);
      const variant = clothing.variants.find(
        (variant) => variant.size === size
      );

      variant.quantity += quantity;
      clothing.inStock = clothing.variants.some(
        (variant) => variant.quantity > 0
      );

      await clothing.save();

      return {
        size: variant.size,
        quantity: variant.quantity,
      };
    },
  }
}

export default increaseInventoryResolvers;