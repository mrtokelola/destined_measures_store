import clothing from './clothing/index.js';
import order from './order/index.js';

const resolvers = {
  Query: {
    ...(clothing.Query || {}),
    ...(order.Query || {}),
  },
  Mutation: {
    ...(clothing.Mutation || {}),
    ...(order.Mutation || {}),
  }
}

export default resolvers;