import "~/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { NavigationBar } from "~/components/navigation/navigation-bar";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <>
      {router.pathname !== "/" && <NavigationBar />}
      {/*<div className="py-[50px] md:py-[80px] lg:py-[100px] xl:py-[120px] lg:px-[15%] md:px-[5%] flex flex-wrap justify-center items-start gap-4 p-4 "> */}
      {/* <div className="ml-2 md:ml-5 lg:ml-10 xl:ml-10"> */}
      <Component {...pageProps} />
      {/* </div> */}
      {/* </div> */}
    </>
  );
}
