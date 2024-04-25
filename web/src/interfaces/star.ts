import { Movie } from "./movie";

export interface StarDetail {
  id: string;
  name: string;
  birthYear: number | "N/A";
  movies: Movie[];
}

export interface Star {
  birthYear: number;
  numMovies: number;
  id: number;
  name: string;
  url: string;
}
