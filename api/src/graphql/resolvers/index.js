import clothing from './clothing/index.js';

const resolvers = {
  Query: {
    ...(clothing.Query || {}),
  },
  Mutation: {
    ...(clothing.Mutation || {}),
  }
}

export default resolvers;