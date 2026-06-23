import gql from "graphql-tag";

// type = format of data the API returns
// input = format of data the API accepts
// enum = list of allowed values
// type query = used to GET/fetch/read data
// type Mutation =

const types = gql`
  type Variant {
    size: String!
    quantity: Int!
    reservedQuantity: Int!
  }

  input VariantInput {
    size: String!
    quantity: Int!
    reservedQuantity: Int
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
  
  type OrderItem {
    productId: ID
    name: String!
    price: Float
    size: String!
    color: String
    quantity: Int
  }
  
  type Customer {
    name: String!
    email: String
  }
  
  type Order {
    id: ID!
    customer: Customer
    items: [OrderItem!]!
    total: Float
    createdAt: String
  }

  type PaymentIntentResult {
    clientSecret: String!
  }
  
  input OrderItemInput {
    productId: ID!
    name: String!
    price: Float
    size: String!
    color: String
    quantity: Int
  }
  
  input CustomerInput {
    name: String
    email: String
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
    orders: [Order!]!
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
    
    createOrder(
      customer: CustomerInput!
      items: [OrderItemInput!]!
      total: Float!
    ): Order!

    updateClothing(
      id: ID!
      name: String!
      price: Float!
      category: String!
      inStock: Boolean!
      imageUrl: String!
      color: String!
      variants: [VariantInput!]!
    ): Clothing!

    createPaymentIntent(
      amount: Int!
      items: [OrderItemInput!]!
    ): PaymentIntentResult!

    deleteClothing(id: ID!): Clothing!

    deleteOrder(id: ID!): Order!
      
    decreaseInventory(
      productId: ID! 
      size: String!
      quantity: Int!
    ): Variant
      
    increaseInventory(
      productId: ID!
      size: String!
      quantity: Int!
    ): Variant

    reserveInventory(
        productId: ID!
        size: String!
        quantity: Int!
    ): Variant

    releaseReservedInventory(
        productId: ID!
        size: String!
        quantity: Int!
    ): Variant
  }
`;

export default types;