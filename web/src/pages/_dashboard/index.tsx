// At the top of your file
import React, { useState } from "react";
import EmployeeOnly from "~/components/EmployeeOnly";

const Dashboard: React.FC = () => {
  return (
    <>
      <EmployeeOnly>
        <div className="py-[50px] md:py-[80px] lg:py-[100px] xl:py-[120px] lg:px-[15%] md:px-[5%] flex flex-wrap justify-center items-start gap-4 p-4">
          dashboard
        </div>
      </EmployeeOnly>
    </>
  );
};
export default Dashboard;
