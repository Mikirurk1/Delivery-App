"use client";

import { ApolloProvider } from "@apollo/client/react";
import { Provider as ReduxProvider } from "react-redux";
import { apolloClient } from "@/shared/lib/apollo-client";
import { store } from "@/shared/store/store";
import { ToastViewport } from "@/components/atoms/ToastViewport";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <ApolloProvider client={apolloClient}>
        {children}
        <ToastViewport />
      </ApolloProvider>
    </ReduxProvider>
  );
}
