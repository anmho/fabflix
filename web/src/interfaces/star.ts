import { Movie } from "./movie";

export interface StarDetail {
  id: number;
  name: string;
  birthYear: number | "N/A";
  movies: Movie[];
}
