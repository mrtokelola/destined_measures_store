const deleteClothingResolvers = {
  Mutation: {
    deleteClothing: async (_parent, { id }, { db }) => {
      const deleted = await db.Clothing.findByIdAndDelete(id);
      return deleted;
    },
  },
};

export default deleteClothingResolvers;