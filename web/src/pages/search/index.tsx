import { Head } from "next/document";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ComboboxDemo } from "~/components/combobox";
import MovieCard from "~/components/MovieCard";
import { Filters, FiltersDropdown } from "~/components/search/filters-dropdown";
import SearchOptionsDropdown from "~/components/search/options-dropdown";
import { PaginationDemo } from "~/components/search/pagination-demo";
import { PaginationDropdown } from "~/components/search/pagination-dropdown";
import { SortDropdown } from "~/components/search/sort-dropdown";
import { BentoGrid } from "~/components/ui/bento-grid";
import { Pagination } from "~/components/ui/pagination";
import { Movie } from "~/interfaces/movie";
import { handleAddToCart } from "~/services/carts";
import { fetchTopMovies } from "~/services/movies";

const SearchMoviesPage: React.FC = () => {
  const searchParams = useSearchParams();
  // const { title, star, director, year }: Filters = searchParams.getAll();
  console.log(searchParams);

  return (
    <div className="flex align-center flex-col h-screen">
      <div className="flex justify-around align-center">
        <PaginationDropdown className="mr-1" />
        <div className="flex items-center justify-center">
          <FiltersDropdown
            className="mr-1"
            initialFilters={{ title: "term", star: "arn", director: "james" }}
          />
          <SortDropdown />
        </div>
      </div>
      <div className="flex items-center align-center w-screen bg-green-500 flex-col">
        <div className="bg-red-500 w-5 h-5"></div>
        <div className="bg-red-500 w-5 h-5"></div>
        <div className="bg-red-500 w-5 h-5"></div>
        <div className="bg-red-500 w-5 h-5"></div>
      </div>
      <PaginationDemo />
      <BentoGrid />
    </div>
  );
};

export default SearchMoviesPage;