import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { handleCheckout } from "~/api/checkout";
import { isUserLoggedIn } from "~/api/login";
import { fetchCart, handleEditFromCart } from "~/api/cart";
import { Movie } from "~/interfaces/movie";
import { MovieCard } from "~/components/MovieCard";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "~/utils/cn";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

import { Button } from "~/components/ui/button";
import { BackButton } from "~/components/navigation/back-button";
import { Loading } from "~/components/navigation/loading";

const CheckoutPage: React.FC = () => {
  const [creditCardId, setCreditCardId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);
  const [cartItems, setCartItems] = useState<Movie[]>([]);
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<String>("");
  const [totalBill, setTotalBill] = useState<number>(0);

  useEffect(() => {
    isUserLoggedIn().then(({ isLoggedIn }) => {
      if (!isLoggedIn) {
        router.push("/login");
      } else {
        getCartItems();
      }
    });
  }, [router]);
  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalBill(total);
  }, [cartItems]);
  const getCartItems = async () => {
    try {
      const cart = await fetchCart();
      setCartItems(cart.movies);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      setIsLoading(false);
    }
  };

  const updateCartItems = async () => {
    setIsLoading(true);
    await getCartItems();
    setIsLoading(false);
  };

  const handleEditItem = async (movieId: string, quantity: number) => {
    await handleEditFromCart(movieId, quantity, updateCartItems);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await handleCheckout({
        creditCardId,
        firstName,
        lastName,
        expirationDate,
      });

      if (!data.success) {
        setErrorMsg(data.message);
      } else {
        router.push({
          pathname: "/confirmation",
          query: { data: JSON.stringify(data) },
        });
      }

      setIsLoading(false);
      // console.log(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="mx-auto px-4 bg-background">
      <BackButton />
      <div className="max-w-md w-full mx-auto rounded-lg p-4 shadow-md bg-white">
        <h2 className="font-bold text-xl mb-4">Checkout Details</h2>

        <form onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name."
              required
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name."
              required
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="creditCardId">Credit Card ID</Label>
            <Input
              id="creditCardId"
              value={creditCardId}
              onChange={(e) => setCreditCardId(e.target.value)}
              placeholder="Enter your credit card ID."
              required
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="expirationDate">Expiration Date</Label>
            <Input
              id="expirationDate"
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              required
            />
          </LabelInputContainer>
          {errorMsg !== "" && (
            <div
              className="my-2 bg-red-100 w-full border border-red-400 text-red-700 px-4 py-3 rounded"
              role="alert"
            >
              <strong className="font-bold">Error! </strong>
              <span className="block sm:inline">{errorMsg}</span>
            </div>
          )}
          <div className="text-lg font-semibold my-4">
            Total Bill: ${totalBill.toFixed(2)}
          </div>
          <button
            className="bg-gradient-to-br from-black dark:from-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium"
            type="submit"
          >
            Complete Checkout
          </button>
        </form>
      </div>
      <div className="flex flex-wrap justify-around items-start mt-8">
        {cartItems.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isCartPage={true}
            handleAddToCart={() => {}} //
            updateMovies={updateCartItems}
          />
        ))}
      </div>
    </div>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default CheckoutPage;

/*
FANCY CALENDAR BUT HARDER TO USE FOR THE DATASET GIVEN


import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { handleCheckout } from "~/services/checkout";
import { isLoggedIn } from "~/services/login";
import { fetchCartItems, handleEditFromCart } from "~/services/carts";
import { Movie } from "~/interfaces/movie";
import MovieCard from "~/components/MovieCard";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "~/utils/cn";
import { DatePicker } from "~/components/DatePicker";
import { format } from "date-fns";
const CheckoutPage: React.FC = () => {
  const [creditCardId, setCreditCardId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);
  const [cartItems, setCartItems] = useState<Movie[]>([]);
  const router = useRouter();

  useEffect(() => {
    isLoggedIn().then(({ success }) => {
      if (!success) {
        router.push("/login");
      } else {
        getCartItems();
      }
    });
  }, [router]);

  const getCartItems = async () => {
    try {
      const items = await fetchCartItems();
      setCartItems(items);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      setIsLoading(false);
    }
  };

  const updateCartItems = async () => {
    setIsLoading(true);
    await getCartItems();
    setIsLoading(false);
  };

  const handleEditItem = async (movieId: string, quantity: number) => {
    await handleEditFromCart(movieId, quantity, updateCartItems);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    const formattedDate = expirationDate
      ? format(expirationDate, "yyyy-MM-dd")
      : "";

    try {
      const data = await handleCheckout({
        creditCardId,
        firstName,
        lastName,
        expirationDate: formattedDate,
      });
      setResponse(data);
      setIsLoading(false);
      console.log(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="mx-auto px-4 bg-background">
      <div className="max-w-md w-full mx-auto rounded-lg p-4 shadow-md bg-white">
        <h2 className="font-bold text-xl mb-4">Checkout Details</h2>
        <form onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name."
              required
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name."
              required
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="creditCardId">Credit Card ID</Label>
            <Input
              id="creditCardId"
              value={creditCardId}
              onChange={(e) => setCreditCardId(e.target.value)}
              placeholder="Enter your credit card ID."
              required
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="expirationDate">Expiration Date</Label>
            <DatePicker date={expirationDate} setDate={setExpirationDate} />
          </LabelInputContainer>
          {error && <div className="text-red-500">{error}</div>}
          <button
            className="w-full bg-blue-500 text-white rounded-lg p-2 mt-4"
            type="submit"
          >
            Complete Checkout
          </button>
        </form>
      </div>
      <h2 className="font-bold text-xl text-center mt-10">Items to checkout</h2>
      <div className="flex flex-wrap justify-center items-start mt-2">
        {cartItems.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isCartPage={true}
            handleAddToCart={() => {}}
            updateMovies={updateCartItems}
          />
        ))}
      </div>
    </div>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default CheckoutPage;

*/
