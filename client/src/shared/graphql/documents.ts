import { gql } from "@apollo/client";

export const SHOPS_QUERY = gql`
  query Shops($ratingMin: Float, $ratingMax: Float) {
    shops(ratingMin: $ratingMin, ratingMax: $ratingMax) {
      id
      name
      rating
    }
  }
`;

export const CATEGORIES_QUERY = gql`
  query Categories {
    categories {
      id
      name
    }
  }
`;

export const PRODUCTS_QUERY = gql`
  query Products($filters: ProductFiltersInput!) {
    products(filters: $filters) {
      items {
        id
        name
        price
        imageUrl
        shopId
        categoryId
        category {
          id
          name
        }
      }
      page
      pageSize
      total
    }
  }
`;

export const CHECKOUT_MUTATION = gql`
  mutation Checkout($input: CheckoutInput!) {
    checkout(input: $input) {
      id
      createdAt
      email
      phone
      address
      total
      items {
        productId
        productName
        productPrice
        quantity
      }
    }
  }
`;

export const ORDERS_QUERY = gql`
  query Orders($email: String, $phone: String, $orderId: String) {
    orders(email: $email, phone: $phone, orderId: $orderId) {
      id
      createdAt
      email
      phone
      address
      total
      items {
        productId
        productName
        productPrice
        quantity
      }
    }
  }
`;

export const REORDER_MUTATION = gql`
  mutation Reorder($orderId: String!) {
    reorder(orderId: $orderId) {
      items {
        productId
        productName
        productPrice
        quantity
      }
    }
  }
`;
