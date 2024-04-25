import { Genre } from "./genre";
import { Star } from "./star";

export interface Movie {
  id: string;
  title: string;
  year: number;
  director: string;
  genres: Genre[];
  stars: Star[];
  rating: number;
  quantity: number;
  price: number;
}

export interface MovieList {
  movies: Movie[];
  total: number;
}
