// At the top of your file
import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";
import { Loading } from "~/components/navigation/loading";
import { useAuth } from "~/hooks/AuthProvider";

const employeeLogin: React.FC = () => {
  const router = useRouter();
  const { session, login } = useAuth();

  useEffect(() => {
    console.log("yo", session);
  }, [session]);

  return (
    <>
      <div className="py-[50px] md:py-[80px] lg:py-[100px] xl:py-[120px] lg:px-[15%] md:px-[5%] flex flex-wrap justify-center items-start gap-4 p-4">
        employee login
      </div>
    </>
  );
};

export default employeeLogin;
