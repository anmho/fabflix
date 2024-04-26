import "~/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { NavBar } from "~/components/navigation/nav-bar";
import { Toaster } from "~/components/ui/sonner";
import { useEffect } from "react";
import { AuthProvider } from "~/hooks/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  SearchContextProvider,
  useSearch,
} from "~/hooks/SearchContextProvider";
import { queryClient } from "~/api/http";
import { ThemeProvider } from "~/hooks/ThemeProvider";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <ThemeProvider>
      <NextUIProvider>
        <QueryClientProvider client={queryClient}>
          <SearchContextProvider>
            <AuthProvider>
              {router.pathname !== "/" && <NavBar />}
              <Component {...pageProps} />
            </AuthProvider>
            <Toaster />
          </SearchContextProvider>
        </QueryClientProvider>
      </NextUIProvider>
    </ThemeProvider>
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
