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
import { Skeleton } from "~/components/ui/skeleton";
import { useTheme } from "next-themes";
import { Badge } from "./ui/badge";
import { cn } from "~/lib/utils";
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
  const { theme } = useTheme();

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

  useEffect(() => {}, [movie]);
  console.log("movie", movie);

  return (
    <Card className="w-full max-w-xs m-2 border-border bg-card text-card-foreground shadow-sm">
      <div>
        <img
          alt="Movie Poster"
          className="rounded-t-lg object-cover h-48 w-full"
          src="https://m.media-amazon.com/images/I/61sQGAWUOWL._AC_UF894,1000_QL80_DpWeblab_.jpg"
        />
      </div>

      <CardContent className={cn(theme, "p-6 space-y-4")}>
        <h3 className="text-xl font-bold text-foreground -z-1">
          {movie.title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {movie.year} • {movie.director}
        </p>
        {/* <p className="text-sm text-gray-500 dark:text-gray-400"> */}
        <div>
          {movie.stars.map((star, index) => (
            <Badge
              key={star.id}
              className="bg-background border-border text-foreground mr-1"
            >
              <Link
                href={`/stars/${star.id}`}
                // className="text-blue-600 hover:text-blue-800"
              >
                {star.name}
              </Link>
            </Badge>
          ))}
        </div>

        {!isCartPage ? (
          <>
            <p className={cn(theme, "text-foreground")}>
              {movie.genres.map((genre) => (
                <Badge className="m-[2px]">{genre.name}</Badge>
              ))}
            </p>

            {movie.rating !== -1 && (
              <div className="text-sm font-bold">
                Rating: {movie.rating.toFixed(1)}
              </div>
            )}
            <Link href={`/movies/${movie.id}`}>
              <p
                className={cn(
                  theme,
                  "bg-muted-background text-secondary-foreground hover:text-muted-foreground transition-all"
                )}
              >
                Learn More →
              </p>
            </Link>

            <Button
              className={cn(theme, "bottom-0 border border-border w-full")}
              onClick={handleAddToCart}
            >
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
                  <Button
                    onClick={handleDecrease}
                    className="bg-background border-border hover:bg-muted text-red-500 mr-2"
                  >
                    <FaMinus />
                  </Button>
                  <span>{quantity}</span>
                  <Button
                    onClick={handleIncrease}
                    className="bg-background hover:bg-muted text-blue-500 ml-2"
                  >
                    <FaPlus />
                  </Button>
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

export function MovieCardLoading() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

export { MovieCard };
