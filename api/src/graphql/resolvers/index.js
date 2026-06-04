import clothing from './clothing/index.js';
import orderResolvers from "./orders/index.js";

const resolvers = {
  Query: {
    ...(clothing.Query || {}),
    ...(orderResolvers.Query || {}),
  },
  Mutation: {
    ...(clothing.Mutation || {}),
  }
}

export default resolvers;