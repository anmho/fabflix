import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface CheckoutItem {
  id: string;
  title: string;
  year: number;
  director: string;
  rating: number;
  price: number;
  quantity: number;
}

interface CheckoutResponse {
  success: boolean;
  data: {
    totalCheckoutAmount: number;
    checkedOutItems: CheckoutItem[];
  };
}

const ConfirmationPage: React.FC = () => {
  const router = useRouter();
  const [response, setResponse] = useState<CheckoutResponse | null>(null);

  useEffect(() => {
    if (router.query.data) {
      const data = JSON.parse(router.query.data as string);
      setResponse(data);
    }
  }, [router.query.data]);

  if (!response) {
    return <div>Loading...</div>;
  }

  const handleRedirect = () => {
    router.push("/movies"); // Redirects to the movies page
  };

  return (
    <div className="mx-auto px-4 bg-background">
      <div className="max-w-md w-full mx-auto rounded-lg p-4 shadow-md bg-white">
        <h2 className="font-bold text-xl mb-4">Payment Successful</h2>
        <p>
          Your payment of ${response.data.totalCheckoutAmount.toFixed(2)} has
          been successfully processed.
        </p>
        <h3 className="text-lg mt-4 font-semibold">Checked-out Items:</h3>
        <ul>
          {response.data.checkedOutItems.map((item) => (
            <li key={item.id}>
              {item.title} - ${item.price.toFixed(2)} (Quantity: {item.quantity}
              )
            </li>
          ))}
        </ul>
        <button
          className="bg-gradient-to-br mt-4 from-black dark:from-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium"
          type="button"
          onClick={handleRedirect}
        >
          Continue to Movies
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
