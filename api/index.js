import { ApolloServer } from "apollo-server";
import typeDefs from "./schema/type-defs.js";
import resolvers from "./schema/resolvers.js";

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(3000).then(({ url }) => {
  console.log( `Server started at: ${url}` );
});