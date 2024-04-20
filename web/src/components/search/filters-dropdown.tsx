// import { CaretSortIcon } from "@radix-ui/react-icons";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { SlidersHorizontal } from "lucide-react";
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
}

export function FiltersDropdown({ className }: FiltersDropdownProps) {
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
                placeholder="The Terminator"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="star">Star</Label>
              <Input
                id="star"
                placeholder="Arnold Schwarzenegger"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="director">Director</Label>
              <Input
                id="Director"
                placeholder="James Cameron"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                placeholder={"1984"}
                className="col-span-2 h-8"
              />
            </div>
          </div>
        </div>

        {/* <div className="flex justify-between mt-4">
          <Button variant="default">Apply</Button>
          <Button variant="secondary">Clear</Button>
        </div> */}
      </PopoverContent>
    </Popover>
  );
}
