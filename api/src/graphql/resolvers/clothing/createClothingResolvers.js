const createClothingResolvers = {
  Mutation: {
    createClothing: async (_parent, args, { db }) => {
      return db.Clothing.create(args);
    },
  }
}

export default createClothingResolvers;