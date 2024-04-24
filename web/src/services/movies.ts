import { MovieSortDimension } from "~/components/search/sort/dimensions";
import { Movie } from "~/interfaces/movie";
import { PaginatedResult } from "~/interfaces/paginated-result";

export interface MovieFilters {
  title?: string;
  star?: string;
  director?: string;
  year?: number;
  startsWith?: string;
  genre?: string;
  // toString: () => {

  // };
}

export interface FindMoviesParams {
  filters?: MovieFilters;
  sortBy?: MovieSortDimension[];
  limit?: number;
  page?: number;
}

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
    for (let key in filters) {
      const value = filters[key as keyof typeof filters];

      if (value) {
        if (key === "startsWith") key = "starts-with";
        url.searchParams.append(key, value.toString());
      }
    }
  }
  if (sortBy && sortBy.length > 0) {
    const sortByString = sortBy
      .map((dimension) =>
        new MovieSortDimension(dimension.field, dimension.order).toString()
      )
      .join(",");
    console.log(sortByString);
    url.searchParams.append("sort-by", sortByString);
  }

  url.searchParams.append("limit", limit.toString());
  url.searchParams.append("page", page.toString());

  const res = await fetch(url.toString(), {
    credentials: "include",
  });
  if (res.status === 401) {
    window.location.href = "/login";
  }

  if (!res.ok) {
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
