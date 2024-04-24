// import { CaretSortIcon } from "@radix-ui/react-icons";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { SlidersHorizontal } from "lucide-react";
import { ChangeEvent, FormEvent, FormEventHandler, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";



interface FiltersDropdownProps {
  className?: string;
  initialFilters: Filters;
  onApplyFilters: () => void;
}

export function FiltersDropdown({
  className,
  initialFilters,
  onApplyFilters,
}: FiltersDropdownProps) {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters((filters) => {
      return { ...filters, title: e.target.value };
    });
  };

  const handleChangeStar = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(filters.star);
    setFilters((filters) => {
      return { ...filters, star: e.target.value };
    });
  };

  const handleChangeDirector = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters((filters) => {
      return { ...filters, director: e.target.value };
    });
  };

  const handleChangeYear = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters((filters) => {
      return { ...filters, year: parseInt(e.target.value) }; // handle
    });
  };

  const handleClear = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFilters(() => {
      return {};
    });
    console.log("trying to clear filters", filters);
  };

  const handleApply = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onApplyFilters();
  };

  return (
    <Popover>
      <PopoverTrigger asChild className={className}>
        <Button variant="outline">
          {/* Filters */}
          {/* <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
          <SlidersHorizontal className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filters</h4>
            <p className="text-sm text-muted-foreground">
              Set the filters for your movie search.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                onChange={handleChangeTitle}
                value={filters.title ?? ""}
                placeholder="The Terminator"
                className="col-span-2 h-8"
              />
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
                id="Director"
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
