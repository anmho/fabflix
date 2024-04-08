import { Movie } from "~/interfaces/movie";

export const fetchTopMovies = async (): Promise<Movie[]> => {
  console.log(process.env.NODE_ENV);
  console.log("process.env.API_URL", process.env.NEXT_PUBLIC_API_URL);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies`);
  const movies = await res.json();
  console.log("movies", movies);

  return movies;
};

export const getMovieById = async (id: string): Promise<Movie> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies?id=${id}`);
  const movie = await res.json();
  return movie;
};
