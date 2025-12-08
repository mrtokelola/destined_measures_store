import { gql } from "apollo-server";

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    username: String!
  },
  type Clothing {
    id: ID!
    description: String!
    brand: String!
  }
  
  type Query {
    users: [User!]!
    clothings: [Clothing!]!
  },
`;

export default typeDefs