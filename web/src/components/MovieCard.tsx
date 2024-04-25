import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Movie } from "~/interfaces/movie";
import { FaM, FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import { AiOutlineDelete } from "react-icons/ai";
import { MdAddShoppingCart } from "react-icons/md";

import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { handleEditFromCart } from "../api/cart";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";

const MovieCard = ({
  movie,
  isCartPage,
  handleAddToCart,
  updateMovies,
}: {
  movie: Movie;
  isCartPage: boolean;
  handleAddToCart: () => void;
  updateMovies: () => void;
}) => {
  const [quantity, setQuantity] = useState(movie.quantity);

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    handleEditFromCart(movie.id, newQuantity, updateMovies);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      handleEditFromCart(movie.id, newQuantity, updateMovies);
    }
  };

  const handleRemove = () => {
    handleEditFromCart(movie.id, 0, updateMovies); // Set quantity to zero to trigger removal
  };

  useEffect(() => {
    // console.log("moviecard", movie);
  }, [movie]);

  return (
    <Card className="w-full max-w-xs m-2 border-border bg-card text-card-foreground shadow-sm">
      <div>
        <img
          alt="Movie Poster"
          className="rounded-t-lg object-cover h-48 w-full"
          src="https://m.media-amazon.com/images/I/61sQGAWUOWL._AC_UF894,1000_QL80_DpWeblab_.jpg"
        />
      </div>

      <CardContent className="p-6 space-y-4">
        <h3 className="text-xl font-bold">{movie.title}</h3>
        <p className="text-gray-500 dark:text-gray-400">
          {movie.year} • {movie.director}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {movie.stars.map((star, index) => (
            <span key={star.id}>
              <Link
                href={`/stars/${star.id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {star.name}
              </Link>
              {index < movie.stars.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>

        {!isCartPage ? (
          <>
            <p>Genres: {movie.genres.map((genre) => genre.name).join(", ")}</p>
            <Link
              href={`/movies/${movie.id}`}
              className="text-blue-500 hover:text-blue-800 block mt-2"
            >
              Learn More About {movie.title} →
            </Link>
            {movie.rating !== -1 && (
              <div className="text-sm font-bold">
                Rating: {movie.rating.toFixed(1)}
              </div>
            )}
            <Button className="w-full" onClick={handleAddToCart}>
              Add to cart
            </Button>
          </>
        ) : (
          <>
            <div className="text-xs font-bold">
              Total Price: ${(movie.quantity * movie.price).toFixed(2)}
            </div>
            <div className="mt-2">
              <div className="flex justify-between mt-5">
                <div className="flex items-center">
                  <button
                    onClick={handleDecrease}
                    className="text-red-500 mr-2"
                  >
                    <FaMinus />
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={handleIncrease}
                    className="text-blue-500 ml-2"
                  >
                    <FaPlus />
                  </button>
                </div>
                <button
                  onClick={handleRemove}
                  className="text-red-900 font-bold"
                >
                  <AiOutlineDelete
                    style={{ fontSize: "24px", fontWeight: "bold" }}
                  />
                </button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export { MovieCard };
