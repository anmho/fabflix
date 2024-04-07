import { Movie } from "~/interfaces/movie";

export const fetchTopMovies = async (): Promise<Movie[]> => {
  const res = await fetch("http://localhost:8080/api/movies");
  const movies = await res.json();
  console.log("movies", movies);

  return movies;
};

export const getMovieById = async (id: string): Promise<Movie> => {
  const res = await fetch(`http://localhost:8080/api/movies?id=${id}`);
  const movie = await res.json();
  return movie;
};
