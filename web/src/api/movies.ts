import { Movie, MovieSortDimension } from "~/interfaces/movie";
import { PaginatedResult } from "~/interfaces/paginated-result";
import { http } from "./http";
import { MovieParams } from "~/validators/movies";
import { List } from "postcss/lib/list";

export interface MovieFilters {
  title?: string;
  star?: string;
  director?: string;
  year?: number;
  startsWith?: string;
  genre?: string;
}

export interface MovieCompletion {
  id: string;
  title: string;
  director: string;
  year: number;
}

export interface AutoCompleteResponse {
  response: MovieCompletion[] | [];
  message?: string;
}
export interface MovieSearchParams {
  filters?: MovieFilters;
  sortBy?: MovieSortDimension[];
  limit?: number;
  page?: number;
}

export function movieSearchParamsToURLParams(
  movieSearchParams: MovieSearchParams
): URLSearchParams {
  const { filters, sortBy, limit, page } = movieSearchParams;
  const params = new URLSearchParams();

  if (filters) {
    for (let key in filters) {
      const value = filters[key as keyof typeof filters];
      if (value) {
        params.set(key, value.toString());
      }
    }
  }

  if (sortBy) {
    const sortStrings = sortBy.map((dimension) =>
      new MovieSortDimension(dimension.field, dimension.order).toString()
    );
    if (sortStrings.length > 0) {
      params.append("sortBy", sortStrings.join(","));
    }
  }
  if (limit) {
    params.append("limit", limit.toString());
  }
  if (page) {
    params.append("page", page.toString());
  }
  return params;
}

export const findMovies = async ({
  filters,
  sortBy,
  limit,
  page,
}: MovieSearchParams): Promise<PaginatedResult<Movie>> => {
  const params = new URLSearchParams();
  limit = limit ?? 25;
  page = page ?? 1;

  if (filters) {
    for (let key in filters) {
      const value = filters[key as keyof typeof filters];

      if (value) {
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
    // console.log(sortByString);
    params.append("sortBy", sortByString);
  }

  params.append("limit", limit.toString());
  params.append("page", page.toString());
  const res = await http.get("/movies?", { params }).catch((error: unknown) => {
    // if (error.status === 401) {
    //   window.location.href = "/login";
    // }
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

export const createMovie = async (
  params: MovieParams
): Promise<{ id: string }> => {
  const response = await http.post("/movies", params);
  return response.data;
};

export const getSearchCompletions = async (
  query: string
): Promise<AutoCompleteResponse> => {
  if (query.length < 3) {
    return { response: [], message: "Query too short" };
  }

  const cache = JSON.parse(localStorage.getItem("autocompleteCache") || "{}");

  if (cache[query]) {
    return { response: cache[query], message: "Cache hit" };
  }

  const response = await http.get(`/search?query=${query}`);

  cache[query] = response.data;
  localStorage.setItem("autocompleteCache", JSON.stringify(cache));

  return { response: response.data, message: "Cache miss" };
};
