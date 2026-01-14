const orderResolvers = {
  Query: {
    order: async (_parent, { id }, { dataSources }) => {
      return dataSources.order.getOrderById(id);
    },
  },

  Mutation: {
    createOrder: async (_parent, { input }, { dataSources }) => {
      return dataSources.order.createOrder(input);
    },
  },
};

export default orderResolvers;
