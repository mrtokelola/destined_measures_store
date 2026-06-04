const updateClothingResolvers = {
  Mutation: {
    updateClothing: async (_parent, args, { db }) => {
      const { id, ...updateData } = args;

      const updated = await db.Clothing.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      return updated;
    },
  },
};

export default updateClothingResolvers;