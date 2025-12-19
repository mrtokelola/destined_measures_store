import { gql } from "apollo-server";

const typeDefs = gql`
    type User {
      id: ID!
      name: String!
      username: String!
    }

    type Variant {
      size: String!
      quantity: Int!
    }

    type Clothing {
      id: ID!
      name: String!
      price: Float!
      category: String!
      variants: [Variant!]!
      inStock: Boolean!
      imageUrl: String!
    }

    input VariantInput {
      size: String!
      quantity: Int!
    }

    type ClothesPage {
      items: [Clothing!]!
      totalCount: Int!
      page: Int!
      limit: Int!
      totalPages: Int!
      hasNextPage: Boolean!
      hasPrevPage: Boolean!
    }

    type Query {
      users: [User!]!
      clothes(page: Int = 1, limit: Int = 6): ClothesPage!
      clothing(id: ID!): Clothing
    }

    type Mutation {
      createClothing(
        name: String!
        price: Float!
        category: String!
        inStock: Boolean!
        imageUrl: String!
        variants: [VariantInput!]!
      ): Clothing!
    }
`;

export default typeDefs;