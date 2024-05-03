import { useRouter } from "next/router";
import { useState } from "react";
import { useAuth } from "~/hooks/AuthProvider";
import { Loading } from "../navigation/loading";

interface PrivatePageProps {
  children: React.ReactNode;
}

export const PrivatePage: React.FC<PrivatePageProps> = ({
  children,
}: PrivatePageProps) => {
  const { session } = useAuth();
  const router = useRouter();
  console.log(session);

  if (
    session === null &&
    router.pathname !== "/login" &&
    router.pathname !== "/employeeLogin" &&
    router.pathname !== "/"
  ) {
    router.push("/login");
    return <Loading />;
  }
  console.log("this page is private", session);
  return <>{children}</>;
};
