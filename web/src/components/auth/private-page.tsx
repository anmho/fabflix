import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Session and Path:", session, router.pathname);
    if (!isLoading) return;
    // immediate access for public paths
    if (
      router.pathname === "/login" ||
      router.pathname === "/employeeLogin" ||
      router.pathname === "/"
    ) {
      setIsLoading(false);
      return;
    }

    if (!session) {
      setIsLoading(true);
      if (router.pathname === "/_dashboard") {
        router.push("/employeeLogin");
      } else {
        router.push("/login");
      }
      return;
    }

    // redirect logic for specific user types and routes
    if (session.userType === "customer") {
      if (router.pathname === "/_dashboard") {
        console.log("Redirecting customer away from _dashboard");
        router.push("/employeeLogin");
        // window.location.href = "/employeeLogin";
        setIsLoading(true);
      } else {
        setIsLoading(false);
      }
    } else if (session.userType === "employee") {
      setIsLoading(false); // employees can navigate freely
    }
  }, [session, router.pathname, isLoading]);

  if (isLoading) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default PrivatePage;
