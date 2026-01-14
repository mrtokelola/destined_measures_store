import { gql } from "apollo-server";

const types = gql`
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
      color: String
    }
    
    enum ClothesSort {
      CATEGORY_ORDER
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
    
    type OrderItem {
      name: String
      price: Float
      size: String
      color: String
      quantity: Int
    }
    
    type Customer {
      name: String!
      email: String!
    }
    
    type Order {
      id: ID!
      customer: Customer
      items: [OrderItem!]!
      total: Float
      createdAt: String
      updatedAt: String
    }
    
    input OrderItemInput {
      name: String!
      price: Float
      size: String
      color: String
      quantity: Int
    }
    
    input CustomerInput {
      name: String
      email: String
    }
    
    input CreateOrderInput {
      customer: CustomerInput
      items: [OrderItemInput!]
      total: Float
    }


    type Query {
      clothes(page: Int = 1, limit: Int = 6, sort: ClothesSort): ClothesPage!
      clothing(id: ID!): Clothing
      order(id: ID!): Order
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
        createOrder(input: CreateOrderInput!): Order!
    }
`;

export default types;