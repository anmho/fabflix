import "~/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { NavigationBar } from "~/components/navigation/navigation-bar";
import { Toaster } from "~/components/ui/sonner";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <>
      {router.pathname !== "/" && <NavigationBar />}
      <Component className="dark" {...pageProps} />
      <Toaster />
    </>
  );
}
