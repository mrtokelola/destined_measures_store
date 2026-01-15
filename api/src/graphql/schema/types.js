import { gql } from "apollo-server";

const types = gql`
  type Variant {
    size: String!
    quantity: Int!
  }

  input VariantInput {
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
    color: String
  }

  enum ClothesSort {
    CATEGORY_ORDER
  }

  input ClothesFilterInput {
    category: String
    color: String
    minPrice: Float
    maxPrice: Float
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

  type ClothesFilters {
    categories: [String!]!
    colors: [String!]!
    minPrice: Float
    maxPrice: Float
  }

  type Query {
    clothes(
      page: Int = 1
      limit: Int = 6
      sort: ClothesSort
      filter: ClothesFilterInput
    ): ClothesPage!

    clothing(id: ID!): Clothing
    clothesFilters: ClothesFilters!
  }

  type Mutation {
    createClothing(
      name: String!
      price: Float!
      category: String!
      inStock: Boolean!
      imageUrl: String!
      color: String!
      variants: [VariantInput!]!
    ): Clothing!
  }
`;

export default types;