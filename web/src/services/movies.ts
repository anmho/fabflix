import { Movie } from "~/interfaces/movie";

export const fetchTopMovies = async (): Promise<Movie[]> => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/movies`);
  url.searchParams.append("sort-by", "rating");
  url.searchParams.append("order", "desc");
  url.searchParams.append("limit", "20");
  url.searchParams.append("page", "1");

  const res = await fetch(url.toString(), {
    credentials: "include",
  });

  if (res.status === 401) {
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
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/movies?id=${id}`,
    {
      credentials: "include",
    }
  );
  const movie = await res.json();
  return movie;
};
