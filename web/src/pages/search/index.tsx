import { Head } from "next/document";
import { useEffect, useState } from "react";
import MovieCard from "~/components/MovieCard";
import { Movie } from "~/interfaces/movie";
import { handleAddToCart } from "~/services/carts";
import { fetchTopMovies } from "~/services/movies";

const SearchMoviesPage: React.FC = () => {
  return <div>Search movies</div>;
};

export default SearchMoviesPage;
