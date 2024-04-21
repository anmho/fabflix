import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Movie } from "~/interfaces/movie";
import { fetchTopMovies } from "../../services/movies";
import MovieCard from "~/components/MovieCard";
import { Button } from "~/components/ui/button";
import { isLoggedIn } from "~/services/login";
import { useRouter } from "next/router";

import {
  fetchCartItems,
  handleAddToCart,
  handleEditFromCart,
} from "../../services/carts";

const CartPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<Boolean>(true);
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
    await fetchCartItems().then((items) => {
      console.log("data", items);
      setCartItems(items);
      setIsLoading(false);
    });
  };

  const updateMovies = () => {
    getCartItems();
  };

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="mx-auto px-4 bg-background">
      <Head>
        <title>Shopping Cart</title>
      </Head>
      <div className="flex flex-wrap justify-between item-center">
        <h1 className="text-2xl font-bold my-6">Shopping Cart</h1>
        <Button
          variant="outline"
          className="my-auto"
          onClick={() => alert("to be implemented")}
        >
          Proceed to payment
        </Button>
      </div>
      <div className="flex flex-wrap justify-around items-start">
        {cartItems.map((item) => (
          <MovieCard
            movie={item}
            isCartPage={true}
            handleAddToCart={() => handleAddToCart(item.id, updateMovies)}
            updateMovies={updateMovies}
          />
        ))}
      </div>
    </div>
  );
};

export default CartPage;
