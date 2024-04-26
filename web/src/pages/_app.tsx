import "~/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { NavigationBar } from "~/components/navigation/navigation-bar";
import { Toaster } from "~/components/ui/sonner";
import { useEffect } from "react";
import { AuthProvider } from "~/hooks/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  SearchContextProvider,
  useSearch,
} from "~/hooks/SearchContextProvider";
import { queryClient } from "~/api/http";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <SearchContextProvider>
          <AuthProvider>
            {router.pathname !== "/" && <NavigationBar />}
            <Component className="dark" {...pageProps} />
          </AuthProvider>
          <Toaster />
        </SearchContextProvider>
      </QueryClientProvider>
    </NextUIProvider>
  );
}

// Define the type for the props explicitly to avoid TypeScript errors
interface ComponentWithSearchProps extends AppProps {
  Component: React.ComponentType<any>; // Use React.ComponentType for component props
}

// Pass props with a defined type
function ComponentWithSearch({
  Component,
  ...props
}: ComponentWithSearchProps) {
  const { recentMovieQuery } = useSearch(); // Ensure useSearch is imported

  return (
    <Component
      className="dark"
      {...props}
      recentMovieQuery={recentMovieQuery}
    />
  );
}
