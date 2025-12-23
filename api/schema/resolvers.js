
const resolvers = {
  Query: {

    clothing: async (_parent, { id }, { models }) => {
      return models.Clothing.findById(id);
    },

    clothes: async (_parent, { page = 1, limit = 6, sort }, { models }) => {
      const skip = (page - 1) * limit;
      const categoryOrder = ["Hoodie", "Tee", "Shorts"];

      const [allItems, totalCount] = await Promise.all([
        models.Clothing.find(),
        models.Clothing.countDocuments(),
      ]);

      let sortedItems = allItems;

      if (sort === "CATEGORY_ORDER") {
        sortedItems = [...allItems].sort((a, b) => {
          return (
            categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
          );
        });
      }

      const items = sortedItems.slice(skip, skip + limit);
      const totalPages = Math.max(1, Math.ceil(totalCount / limit));

      return {
        items,
        totalCount,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      };
    },
  },

  Mutation: {
    createClothing: async (_parent, args, { models }) => {
      return models.Clothing.create(args);
    },
  },
};

export default resolvers;