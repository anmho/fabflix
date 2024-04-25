import "~/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { NavigationBar } from "~/components/navigation/navigation-bar";
import { Toaster } from "~/components/ui/sonner";
import {
  SearchContextProvider,
  useSearch,
} from "~/hooks/SearchContextProvider";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <SearchContextProvider>
      <NextUIProvider>
        {router.pathname !== "/" && <NavigationBar />}
        <ComponentWithSearch Component={Component} {...pageProps} />
        <Toaster />
      </NextUIProvider>
    </SearchContextProvider>
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
