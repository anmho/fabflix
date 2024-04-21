import React, { useEffect, useState } from "react";

const CheckoutPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  if (isLoading) return <div>Loading...</div>;
  return <div className="mx-auto px-4 bg-background"></div>;
};

export default CheckoutPage;
