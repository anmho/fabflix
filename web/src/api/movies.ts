import { MovieSortDimension } from "~/components/search/sort/dimensions";
import { Movie } from "~/interfaces/movie";
import { PaginatedResult } from "~/interfaces/paginated-result";
import { http } from "./http";

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
  const params = new URLSearchParams();
  limit = limit ?? 20;
  page = page ?? 1;

  if (filters) {
    for (let key in filters) {
      const value = filters[key as keyof typeof filters];

      if (value) {
        if (key === "startsWith") key = "starts-with";
        params.append(key, value.toString());
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
    params.append("sort-by", sortByString);
  }

  params.append("limit", limit.toString());
  params.append("page", page.toString());
  const res = await http.get("/movies?", { params }).catch((error) => {
    if (error.status === 401) {
      window.location.href = "/login";
    }
    console.error("Failed to fetch movies", error);
    throw error;
  });

  return res.data;
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
  const movie = await http.get(`/movies?id=${id}`).then((res) => res.data);
  console.log(movie);
  return movie;
};
