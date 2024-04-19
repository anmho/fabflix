import { Movie } from "~/interfaces/movie";

export const fetchTopMovies = async (): Promise<Movie[]> => {
  console.log(process.env.NODE_ENV);
  console.log("process.env.API_URL", process.env.NEXT_PUBLIC_API_URL);

  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/movies`);
  url.searchParams.append("sort-by", "rating");
  url.searchParams.append("order", "desc");
  url.searchParams.append("limit", "20");
  url.searchParams.append("page", "1");

  const res = await fetch(url.toString(), {
    credentials: "include",
  });
  console.log(res);
  if (res.status === 401) {
    console.log('window.location.href = "/login";');
    window.location.href = "/login";
  }
  if (!res.ok) {
    return [];
  }
  const data = await res.json();
  console.log("data", data);
  const movies = data.results;
  console.log("movies", movies);

  return movies;
};

export const getMovieById = async (id: string): Promise<Movie> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies?id=${id}`);
  const movie = await res.json();
  return movie;
};
