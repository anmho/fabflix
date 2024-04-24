import { MovieSortDimension } from "~/components/search/sort/dimensions";
import { Movie } from "~/interfaces/movie";
import { PaginatedResult } from "~/interfaces/pagination";

export interface MovieFilters {
  title?: string;
  star?: string;
  director?: string;
  year?: number;
  startsWith?: string;
  genre?: string;
}

export interface FindMoviesParams {
  filters?: MovieFilters;
  sortBy?: MovieSortDimension[];
  limit?: number;
  page?: number;
}

interface MovieList {}

export const findMovies = async ({
  filters,
  sortBy,
  limit,
  page,
}: FindMoviesParams): Promise<PaginatedResult<Movie>> => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/movies`);
  limit = limit ?? 20;
  page = page ?? 1;

  if (filters) {
    for (const key in filters) {
      const value = filters[key as keyof typeof filters];
      console.log("HELLO", key, value);
      if (value) {
        url.searchParams.append(key, value.toString());
      }
    }
  }
  if (sortBy) {
    const sortByString = sortBy
      .map((dimension) => {
        dimension.toString();
      })
      .join(",");

    console.log(sortByString);
  }

  url.searchParams.append("limit", limit.toString());
  url.searchParams.append("page", page.toString());

  const res = await fetch(url.toString(), {
    credentials: "include",
  });
  if (res.status === 401) {
    window.location.href = "/login";
  }

  console.log(res.url);
  if (!res.ok) {
    console.log(res);
    throw new Error("Failed to fetch movies");
  }
  const data = await res.json();
  return data;
};

export const fetchTopMovies = async (): Promise<Movie[]> => {
  const results = await findMovies({
    sortBy: [new MovieSortDimension("rating", "desc")],
    limit: 20,
    page: 1,
  });
  return results.results;
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
