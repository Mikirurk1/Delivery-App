"use client";

type GraphQLErrorLike = {
  message?: string;
  extensions?: {
    errorId?: unknown;
    code?: unknown;
  };
};

type ErrorLikeWithGraphQL = {
  message?: string;
  graphQLErrors?: unknown;
  errors?: unknown;
  cause?: unknown;
  networkError?: unknown;
};

const ERROR_TEXT_BY_ID: Record<string, string> = {
  ORDERS_INVALID_ID:
    "Invalid order ID format. Please enter 24 hexadecimal characters (a-f, 0-9).",
  ORDERS_NOT_FOUND:
    "Order not found. Please check your details and try again.",
  CHECKOUT_CART_EMPTY: "Your cart is empty. Add items before checkout.",
  CHECKOUT_PRODUCT_NOT_FOUND:
    "One or more items are no longer available. Refresh your cart and try again.",
  SERVER_INTERNAL_ERROR:
    "A server error occurred. Please try again in a moment.",
  NOT_FOUND: "Order not found. Please check your details and try again.",
  AUTH_TOKEN_REQUIRED: "Please refresh the page to continue your session.",
};

const ERROR_TEXT_BY_CODE: Record<string, string> = {
  NOT_FOUND: "Order not found. Please check your details and try again.",
  BAD_USER_INPUT: "Please check your input and try again.",
  UNAUTHENTICATED: "Please refresh the page to continue your session.",
  INTERNAL_SERVER_ERROR: "A server error occurred. Please try again in a moment.",
};

function asGraphQLErrorArray(value: unknown): GraphQLErrorLike[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item) => typeof item === "object" && item !== null,
  ) as GraphQLErrorLike[];
}

function readGraphQLErrors(error: unknown): GraphQLErrorLike[] {
  if (!error || typeof error !== "object") return [];
  const typedError = error as ErrorLikeWithGraphQL;

  const fromGraphQLErrors = asGraphQLErrorArray(typedError.graphQLErrors);
  if (fromGraphQLErrors.length > 0) return fromGraphQLErrors;
  const fromErrors = asGraphQLErrorArray(typedError.errors);
  if (fromErrors.length > 0) return fromErrors;

  if (typedError.cause && typeof typedError.cause === "object") {
    const cause = typedError.cause as { graphQLErrors?: unknown; errors?: unknown };
    const causeGraphQLErrors = asGraphQLErrorArray(cause.graphQLErrors);
    if (causeGraphQLErrors.length > 0) return causeGraphQLErrors;
    const causeErrors = asGraphQLErrorArray(cause.errors);
    if (causeErrors.length > 0) return causeErrors;
  }

  if (typedError.networkError && typeof typedError.networkError === "object") {
    const networkError = typedError.networkError as {
      result?: { errors?: unknown };
    };
    const networkErrors = asGraphQLErrorArray(networkError.result?.errors);
    if (networkErrors.length > 0) return networkErrors;
  }

  return [];
}

function readBackendErrorId(error: unknown): string | undefined {
  const gqlErrors = readGraphQLErrors(error);
  for (const gqlError of gqlErrors) {
    const maybeId = gqlError.extensions?.errorId;
    if (typeof maybeId === "string" && maybeId.length > 0) {
      return maybeId;
    }
  }
  return undefined;
}

export function getUiErrorMessage(
  error: unknown,
  fallbackMessage = "Something went wrong. Please try again.",
): string | undefined {
  if (!error) return undefined;

  const errorId = readBackendErrorId(error);
  if (errorId && ERROR_TEXT_BY_ID[errorId]) {
    return ERROR_TEXT_BY_ID[errorId];
  }

  const firstGraphQLError = readGraphQLErrors(error)[0];
  const code =
    typeof firstGraphQLError?.extensions?.code === "string"
      ? firstGraphQLError.extensions.code
      : undefined;
  const gqlMessage = firstGraphQLError?.message;

  if (code === "INTERNAL_SERVER_ERROR") {
    return fallbackMessage;
  }

  if (code && ERROR_TEXT_BY_CODE[code]) {
    return ERROR_TEXT_BY_CODE[code];
  }

  if (
    typeof gqlMessage === "string" &&
    gqlMessage.length > 0 &&
    !gqlMessage.toLowerCase().includes("prisma.")
  ) {
    return gqlMessage;
  }

  return fallbackMessage;
}
