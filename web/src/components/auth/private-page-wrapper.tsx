import { useRouter } from "next/router";
import { useState } from "react";
import { useAuth } from "~/hooks/AuthProvider";
import { Loading } from "../navigation/loading";

interface PrivatePageProps {
  page: React.ReactNode;
}

export const PrivatePage = ({ page }: PrivatePageProps) => {
  const { session } = useAuth();
  const router = useRouter();
  console.log(session);
  if (session === null) {
    router.push("/login");
    return <Loading />;
  }
  console.log("this page is private", session);
  return page;
};