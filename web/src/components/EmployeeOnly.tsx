import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "~/hooks/AuthProvider"; // Adjust path as necessary
import { Loading } from "~/components/navigation/loading";

const EmployeeOnly = ({ children }: { children: ReactNode }) => {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("yo", session);
    if (!session || session.userType !== "employee") {
      router.push("/employeeLogin");
    }
  }, [session, router]);

  if (!session || session.userType !== "employee") {
    return <Loading />;
  }

  return <>{children}</>;
};

export default EmployeeOnly;
