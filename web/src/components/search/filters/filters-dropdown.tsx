import { ChangeEvent, FormEvent, useState, useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  MovieFilters,
  getSearchCompletions,
  MovieCompletion,
  AutoCompleteResponse,
} from "~/api/movies";
import { cn } from "~/utils/cn";
import { useTheme } from "next-themes";
import { SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/router";
import { debounce } from "~/utils/debounce";
import {
  CommandInput,
  CommandEmpty,
  CommandItem,
  CommandGroup,
  CommandList,
  Command,
} from "~/components/ui/command";

interface FiltersDropdownProps {
  className?: string;
  initialFilters: MovieFilters;
  handleApplyFilters: (filters: MovieFilters) => void;
}

export function FiltersDropdown({
  className,
  initialFilters,
  handleApplyFilters,
}: FiltersDropdownProps) {
  const [filters, setFilters] = useState<MovieFilters>(initialFilters);
  const [titleSuggestions, setTitleSuggestions] = useState<MovieCompletion[]>(
    []
  );
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const { theme } = useTheme();
  const router = useRouter();
  const [movieTitleInput, setMovieTitleInput] = useState<string>("");
  const [canAutoComplete, setCanAutoComplete] = useState<boolean>(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const debouncedGetSearchCompletions = useRef(
    debounce(async (title: string) => {
      const response: AutoCompleteResponse = await getSearchCompletions(title);
      console.log("AUTO COMPLETE RESPONSE: ", response.message);
      setTitleSuggestions(response.response);
    }, 300)
  ).current;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    if (!canAutoComplete) {
      return;
    }
    if (movieTitleInput.length >= 3) {
      debouncedGetSearchCompletions(movieTitleInput);
      setIsDropdownOpen(true);
    } else {
      setTitleSuggestions([]);
      setIsDropdownOpen(false);
    }
  }, [movieTitleInput]);

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters({ ...filters, title: value });
    setMovieTitleInput(value);
    setHighlightedIndex(null);
  };

  const handleSelectSuggestion = (suggestion: MovieCompletion) => {
    setFilters((filters) => ({ ...filters, title: suggestion.title }));
    setMovieTitleInput(suggestion.title);
    setTitleSuggestions([]);
    setIsDropdownOpen(false);
    router.push(`/movies/${suggestion.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (titleSuggestions.length > 0) {
      if (e.key === "ArrowDown") {
        setCanAutoComplete(false);
        setHighlightedIndex((prevIndex) => {
          const newIndex =
            prevIndex === null || prevIndex === titleSuggestions.length - 1
              ? 0
              : prevIndex + 1;
          setMovieTitleInput(titleSuggestions[newIndex].title);
          return newIndex;
        });
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        setCanAutoComplete(false);
        setHighlightedIndex((prevIndex) => {
          const newIndex =
            prevIndex === null || prevIndex === 0
              ? titleSuggestions.length - 1
              : prevIndex - 1;
          setMovieTitleInput(titleSuggestions[newIndex].title);
          return newIndex;
        });
        e.preventDefault();
      } else if (e.key === "Enter" && highlightedIndex !== null) {
        handleSelectSuggestion(titleSuggestions[highlightedIndex]);
        e.preventDefault();
      } else {
        setCanAutoComplete(true);
      }
    }
  };

  const handleChangeStar = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters((filters) => ({ ...filters, star: e.target.value }));
  };

  const handleChangeDirector = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters((filters) => ({ ...filters, director: e.target.value }));
  };

  const handleChangeYear = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters((filters) => ({ ...filters, year: parseInt(e.target.value) }));
  };

  const handleClear = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFilters({
      title: undefined,
      star: undefined,
      director: undefined,
      year: undefined,
    });
    setMovieTitleInput("");
    setIsDropdownOpen(false);
    handleApplyFilters(filters);
  };

  const handleApply = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    handleApplyFilters(filters);
  };

  return (
    <Popover>
      <PopoverTrigger asChild className={className}>
        <Button
          variant="outline"
          className={cn(theme, "bg-background text-foreground")}
        >
          <SlidersHorizontal className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn(theme, "w-80 border-border bg-background")}>
        <div className="grid gap-4" ref={dropdownRef}>
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filters</h4>
            <p className="text-sm text-muted-foreground">
              Set the filters for your movie search.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4 relative">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                onChange={handleChangeTitle}
                onKeyDown={handleKeyDown}
                value={movieTitleInput}
                placeholder="The Terminator"
                className="col-span-2 h-8"
                autoComplete="off"
                onFocus={() => {
                  if (movieTitleInput.length >= 3) {
                    setIsDropdownOpen(true);
                  }
                }}
              />

              {isDropdownOpen && titleSuggestions.length > 0 && (
                <div className="absolute inset-x-0 top-full z-10 mt-1 max-h-60">
                  <Command
                    className={cn(
                      theme,
                      "rounded-md border bg-white shadow-lg dark:border-gray-800 dark:bg-gray-950"
                    )}
                  >
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {titleSuggestions.map((suggestion, index) => (
                          <CommandItem
                            key={index}
                            onClick={() => handleSelectSuggestion(suggestion)}
                            className={`${
                              index === highlightedIndex ? "bg-gray-200" : ""
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{suggestion.title}</span>
                              <small className="text-gray-500 dark:text-gray-400">
                                {suggestion.year} - {suggestion.director}
                              </small>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="star">Star</Label>
              <Input
                id="star"
                onChange={handleChangeStar}
                value={filters.star ?? ""}
                placeholder="Arnold Schwarzenegger"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="director">Director</Label>
              <Input
                id="director"
                onChange={handleChangeDirector}
                value={filters.director ?? ""}
                placeholder="James Cameron"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                onChange={handleChangeYear}
                value={filters.year ?? ""}
                type="number"
                placeholder={"1984"}
                className="col-span-2 h-8"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <Button variant="default" onClick={handleApply}>
            Apply
          </Button>
          <Button variant="secondary" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
