import { useSearchParams } from "next/navigation";
import { FiltersDropdown } from "~/components/search/filters/filters-dropdown";
import { PaginationBar } from "~/components/search/pagination/pagination-bar";
import { PaginationDropdown } from "~/components/search/pagination/pagination-dropdown";
import { SortDropdown } from "~/components/search/sort/sort-dropdown";
import { BentoGrid } from "~/components/ui/bento-grid";

import { z } from "zod";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MovieSortDimension } from "~/components/search/sort/dimensions";
import { MovieCard } from "~/components/MovieCard";
import { PaginatedResult } from "~/interfaces/pagination";
import { Movie } from "~/interfaces/movie";
import { findMovies, FindMoviesParams } from "~/services/movies";

const moviesSearchParamsSchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return Number.parseInt(val);
    }),
  page: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      Number.parseInt(val);
    }),
  startsWith: z.string().optional(),
  title: z.string().optional(),
  year: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return Number.parseInt(val);
    }),
  director: z.string().optional(),
  star: z.string().optional(),
  sortBy: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) {
        return undefined;
      }
      const [field, order] = val.split(":");

      const fieldResults = z.ZodEnum.create(["title", "rating", "year"]).parse(
        field
      );

      const orderResult = z.ZodEnum.create(["asc", "desc"]).parse(order);
      new MovieSortDimension(fieldResults, orderResult);
    }),
});

type MovieSearchParams = z.infer<typeof moviesSearchParamsSchema>;

const getMovieQueryParams = (
  searchParams: URLSearchParams
): FindMoviesParams => {
  const dict: Record<string, unknown> = {};
  searchParams.forEach((value, key) => {
    if (key === "sort-by") {
      key = "sortBy";
    }
    if (key === "starts-with") {
      key = "startsWith";
    }
    dict[key] = value ?? null;
  });
  console.log(dict);

  const params = moviesSearchParamsSchema.parse(dict);

  const findMovieParams = {
    filters: {
      title: params.title,
      director: params.director,
      star: params.star,
      year: params.year,
      startsWith: params.startsWith,
    },
    limit: params.limit,
    page: params.page,
    sortBy: params.sortBy,
  };

  return findMovieParams;
};

const SearchMoviesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useState<FindMoviesParams>({});
  const [searchResults, setSearchResults] = useState<
    PaginatedResult<Movie> | undefined
  >(undefined);
  const query = useSearchParams();

  useEffect(() => {
    const initialSearchParams = getMovieQueryParams(query);
    console.log(initialSearchParams);
  }, [query]);

  useEffect(() => {
    console.log(searchParams);
    findMovies(searchParams).then((res) => {
      setSearchResults(res);
    });
  }, [searchParams]);

  if (!searchResults) {
    return <div>loading...</div>;
  }

  return (
    <div className="flex align-center flex-col h-screen">
      <div className="flex justify-around align-center">
        <PaginationDropdown className="mr-1" />
        <div className="flex items-center justify-center">
          <FiltersDropdown
            onApplyFilters={() => console.log("applying filters")}
            className="mr-1"
            initialFilters={{ title: "term", star: "arn", director: "james" }}
          />
          <SortDropdown />
        </div>
      </div>
      <div className="flex items-center align-center w-screen bg-green-500 flex-col">
        {searchResults.results.map((movie, i) => (
          <MovieCard
            key={i}
            isCartPage={false}
            movie={movie}
            handleAddToCart={() => {}}
            updateMovies={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        ))}
      </div>
      <PaginationBar />
      <BentoGrid />
    </div>
  );
};

export default SearchMoviesPage;
