import { Movie } from "./movie";

export interface StarDetail {
  id: number;
  name: string;
  yearOfBirth: number | "N/A";
  movies: Movie[];
}
