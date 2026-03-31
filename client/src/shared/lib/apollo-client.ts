import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const AUTH_TOKEN_STORAGE_KEY = "delivery_auth_token";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:4000/graphql",
});

let tokenPromise: Promise<string | null> | null = null;

async function fetchAuthToken(): Promise<string | null> {
  const uri = process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:4000/graphql";
  const response = await fetch(uri, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: "query AuthToken { authToken { token } }",
    }),
  });

  if (!response.ok) return null;
  const payload = (await response.json()) as {
    data?: { authToken?: { token?: string } };
  };
  return payload.data?.authToken?.token ?? null;
}

async function getOrCreateAuthToken() {
  if (typeof window === "undefined") return null;
  const existingToken = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (existingToken) return existingToken;

  if (!tokenPromise) {
    tokenPromise = fetchAuthToken().finally(() => {
      tokenPromise = null;
    });
  }

  const token = await tokenPromise;
  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  }
  return token;
}

const authLink = setContext(async (_, prevContext) => {
  const token = await getOrCreateAuthToken();
  const headers = prevContext.headers ?? {};
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
