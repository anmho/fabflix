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
import { PaginatedResult } from "~/interfaces/paginated-result";
import { Movie } from "~/interfaces/movie";
import {
  findMovies,
  MovieSearchParams,
  MovieFilters,
  movieSearchParamsToURLParams,
} from "~/api/movies";
import { ParsedUrlQuery } from "querystring";
import { addMovieToCart } from "~/api/cart";
import { updateMovies } from "../movies";
import { Loading } from "~/components/navigation/loading";
import { set } from "date-fns";
import { PrivatePage } from "~/components/auth/private-page";
import { useSearch } from "~/hooks/SearchContextProvider";
import { cn } from "~/lib/utils";
import { useTheme } from "next-themes";

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
      return Number.parseInt(val);
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
  genre: z.string().optional(),
  sortBy: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) {
        return undefined;
      }

      const sortStrs = val.split(",");

      const dimensions = sortStrs.map((sortStr) => {
        const [field, order] = sortStr.split(":");
        const fieldResults = z.ZodEnum.create([
          "title",
          "rating",
          "year",
        ]).parse(field);
        const orderResult = z.ZodEnum.create(["asc", "desc"]).parse(order);

        return new MovieSortDimension(fieldResults, orderResult);
      });
      return dimensions;
    }),
});

const parseMovieQueryParams = (
  searchParams: ParsedUrlQuery
): MovieSearchParams | null => {
  const dict: Record<string, unknown> = {};
  for (let key in searchParams) {
    const value = searchParams[key];
    console.log(key, value);
    dict[key] = value;
  }

  const result = moviesSearchParamsSchema.safeParse(dict);
  if (!result.success) {
    return null;
  }

  const params = result.data;
  console.log("params", params);

  const findMovieParams = {
    filters: {
      title: params.title,
      director: params.director,
      star: params.star,
      year: params.year,
      startsWith: params.startsWith,
      genre: params.genre,
    },
    limit: params.limit,
    page: params.page,
    sortBy: params.sortBy,
  };

  return findMovieParams;
};

const SearchMoviesPage: React.FC = () => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<
    MovieSearchParams | undefined
  >();
  const [searchResults, setSearchResults] = useState<
    PaginatedResult<Movie> | undefined
  >(undefined);
  const router = useRouter();
  const { recentMovieQuery, updateSearchQuery } = useSearch();
  useEffect(() => {
    // console.log("router.query", router);
    if (router.isReady && searchParams === undefined) {
      // IMPORTANT will cause infinite loop if not checked since router state is updated on filter change
      const initialSearchParams = parseMovieQueryParams(router.query);
      if (initialSearchParams === null) {
        router.push("/404");
        return;
      }
      setSearchParams(() => initialSearchParams);
    }
  }, [router.query, router.isReady, router.asPath]);

  useEffect(() => {
    if (!searchParams) {
      return;
    }

    setIsLoading(true);
    findMovies(searchParams).then((res) => {
      setSearchResults(() => res);
      setIsLoading(false);
    });

    const params = movieSearchParamsToURLParams(searchParams);
    updateSearchQuery(`/search?${params.toString()}`);
    router.replace(
      "/search",
      {
        pathname: router.pathname,
        query: params.toString(),
      },
      { shallow: true }
    );
  }, [searchParams]);

  if (isLoading || !searchResults) {
    return <Loading />;
  }
  // console.log("searchParams", searchParams);
  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      return { ...prev, page };
    });
  };

  const handleApplyFilters = (filters: MovieFilters) => {
    console.log(filters);
    handlePageChange(1);
    setSearchParams((prev) => {
      return { ...prev, filters };
    });
  };

  const handleApplySort = (dimensions: MovieSortDimension[]) => {
    console.log(dimensions);
    handlePageChange(1);
    setSearchParams((prev) => {
      return { ...prev, sortBy: dimensions };
    });
  };

  const handleChangeLimit = (limit: number) => {
    console.log("changing limit", limit);
    handlePageChange(1);
    setSearchParams((prev) => {
      return { ...prev, limit };
    });
  };

  return (
    <div
      className={cn(
        theme,
        "flex align-center flex-col bg-background xl:max-w-[1440px] w-full text-center sm:px-20 px-5 justify-center"
      )}
    >
      <div className="flex justify-around align-center ">
        <PaginationDropdown
          initLimit={searchResults.limit}
          changeLimitParam={handleChangeLimit}
          className="mr-1"
        />
        <PaginationBar
          hasPrev={searchResults._links.prev !== null}
          hasNext={searchResults._links.next !== null}
          handlePageChange={handlePageChange}
          page={searchResults.page}
        />

        <div className="flex items-center justify-center">
          {/* Filters */}
          <FiltersDropdown
            handleApplyFilters={handleApplyFilters}
            className="mr-1"
            initialFilters={searchParams?.filters ?? {}}
          />
          {/* Sort Options */}
          <SortDropdown
            applySort={handleApplySort}
            initDimensions={searchParams?.sortBy}
          />
        </div>
      </div>

      {/* <div className="flex items-center align-center w-screen flex-wrap p-4"> */}
      <div className="grid grid-cols-4 gap-2">
        {searchResults.results.map((movie, i) => (
          <MovieCard
            key={i}
            isCartPage={false}
            movie={movie}
            handleAddToCart={() =>
              addMovieToCart(movie.id, () => updateMovies(movie.title))
            }
            updateMovies={() => {}}
          />
        ))}
      </div>
      <PaginationBar
        hasPrev={searchResults._links.prev !== null}
        hasNext={searchResults._links.next !== null}
        page={searchResults.page}
        handlePageChange={handlePageChange}
      />
      {/* <BentoGrid /> */}
    </div>
  );
};

export default PrivatePage(<SearchMoviesPage />);
// export default SearchMoviesPage;
