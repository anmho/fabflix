import "~/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";

import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { NavigationBar } from "~/components/navigation/navigation-bar";
import { Toaster } from "~/components/ui/sonner";
import { useEffect } from "react";
import { AuthProvider } from "~/hooks/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {router.pathname !== "/" && <NavigationBar />}
          <Component className="dark" {...pageProps} />
        </AuthProvider>
        <Toaster />
      </QueryClientProvider>
    </NextUIProvider>
  );
}
