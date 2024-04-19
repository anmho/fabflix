import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Movie } from "~/interfaces/movie";
import { FaM, FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import { AiOutlineDelete } from "react-icons/ai";
import { MdAddShoppingCart } from "react-icons/md";

import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { handleEditFromCart } from "../services/carts";

const Card = ({
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
  return (
    <CardContainer key={movie.id} className="w-full relative">
      <CardBody className="fg-primary relative group dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] mx-2 rounded-xl p-6 border">
        <>
          <div className="flex justify-between items-between mt-4">
            <CardItem
              translateZ="50"
              className="text-xl font-bold text-neutral-600 dark:text-white"
            >
              {movie.title}
            </CardItem>
            {!isCartPage && (
              <button
                className="text-blue-900 font-bold"
                onClick={handleAddToCart}
              >
                <MdAddShoppingCart
                  style={{ fontSize: "24px", fontWeight: "bold" }}
                />
              </button>
            )}
          </div>
        </>
        <CardItem
          as="p"
          translateZ="30"
          className="text-neutral-500 text-sm dark:text-neutral-300"
        >
          {`${movie.year} • ${movie.director}`}
        </CardItem>
        {!isCartPage && (
          <>
            <CardItem
              as="p"
              translateZ="30"
              className="text-neutral-500 text-sm mt-2 dark:text-neutral-300"
            >
              Actors:{" "}
              {movie.stars.slice(0, 3).map((star, index, slicedArray) => (
                <span key={star.id}>
                  <Link
                    href={`/stars/${star.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {star.name}
                  </Link>
                  {index < slicedArray.length - 1 ? ", " : ""}
                </span>
              ))}
            </CardItem>
            <CardItem
              as="p"
              translateZ="30"
              className="text-neutral-500 text-sm mt-2 dark:text-neutral-300"
            >
              Genres:{" "}
              {movie.genres.slice(0, 3).map((genre, index, slicedArray) => (
                <span key={genre.id}>
                  {genre.name}
                  {index < slicedArray.length - 1 ? ", " : ""}
                </span>
              ))}
            </CardItem>
          </>
        )}{" "}
        <div className="flex justify-between items-center mt-4">
          <CardItem
            translateZ={20}
            as={Link}
            href={`/movies/${movie.id}`}
            className="rounded-xl text-xs font-normal dark:text-white hover:text-blue-500"
          >
            Learn More About {movie.title} →
          </CardItem>
          {movie.rating !== -1 && (
            <CardItem translateZ={20} className="text-xs font-bold">
              {movie.rating.toFixed(1)}
            </CardItem>
          )}
        </div>
        {isCartPage && (
          <div className="mt-2">
            <CardItem translateZ={20} className="text-xs font-bold">
              Total Price: ${(movie.quantity * movie.price).toFixed(2)}
            </CardItem>
            <div className="flex justify-between mt-5">
              <div className="flex items-center">
                <button onClick={handleDecrease} className="text-red-500 mr-2">
                  <FaMinus />
                </button>
                <span>{quantity}</span>
                <button onClick={handleIncrease} className="text-blue-500 ml-2">
                  <FaPlus />
                </button>
              </div>
              <button onClick={handleRemove} className="text-red-900 font-bold">
                <AiOutlineDelete
                  style={{ fontSize: "24px", fontWeight: "bold" }}
                />
              </button>
            </div>
          </div>
        )}
      </CardBody>
    </CardContainer>
  );
};

export default Card;
