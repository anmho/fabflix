import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "~/hooks/AuthProvider"; // Adjust path as necessary
import { Loading } from "~/components/navigation/loading";

const EmployeeOnly = ({ children }: { children: ReactNode }) => {
  const { session } = useAuth();
  const router = useRouter();

  //   useEffect(() => {
  //     console.log("Session:", session);
  //     console.log("router.pathname", router.pathname);

  //     if (
  //       (!session || session.userType !== "employee") &&
  //       router.pathname !== "/_dashboard"
  //     ) {
  //       console.log("Redirecting to /employeeLogin");
  //       router.push("/employeeLogin");
  //     }
  //   }, [session]); // Dependency on 'router' itself might be unnecessary

  return <>{children}</>;
};

export default EmployeeOnly;
