import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/router";

interface SearchContextState {
  recentMovieQuery: string;
  updateSearchQuery: (query: string) => void;
}

const SearchContext = createContext<SearchContextState | null>(null);

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchContextProvider");
  }
  return context;
}

export const SearchContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [recentMovieQuery, setRecentMovieQuery] = useState("/search");
  const router = useRouter();
  const [f, ff] = useState(0);
  const updateSearchQuery = (query: string) => {
    console.log("query", query);
    setRecentMovieQuery(query);
  };

  useEffect(() => {
    console.log("recentMovieQuery", recentMovieQuery);
  }, [recentMovieQuery]);

  useEffect(() => {
    console.log("strat");
  }, []);
  return (
    <SearchContext.Provider value={{ recentMovieQuery, updateSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};
