import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Movie } from "~/interfaces/movie";
import { fetchTopMovies } from "../../services/movies";
import Card from "~/components/Card";
import {
  fetchCartItems,
  handleAddToCart,
  handleEditFromCart,
} from "../../services/carts";

const CartPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [cartItems, setCartItems] = useState<Movie[]>([]);

  const getCartItems = async () => {
    await fetchCartItems().then((items) => {
      console.log("data", items);
      setCartItems(items);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    getCartItems();
  }, []);

  const updateMovies = () => {
    getCartItems();
  };

  console.log(isLoading);

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="mx-auto px-4 bg-background">
      <Head>
        <title>Shopping Cart</title>
      </Head>
      <h1 className="text-2xl font-bold my-6">Shopping Cart</h1>
      <div className="flex flex-wrap justify-around items-start">
        {cartItems.map((item) => (
          <Card
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
