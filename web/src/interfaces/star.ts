import { Movie } from './movie';

export interface StarDetail {
  id: string;
  name: string;
  birthYear: number | 'N/A';
  movies: Movie[];
}
