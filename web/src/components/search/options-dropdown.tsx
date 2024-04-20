/**
 * v0 by Vercel.
 * @see https://v0.dev/t/u0zb47bB4eg
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { SlidersHorizontal } from "lucide-react";
import { FiltersDropdown } from "./filters-dropdown";
import { SortDropdown } from "./sort-dropdown";

export default function SearchOptionsDropdown() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {/* Filters  */}
          {/* <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
          <SlidersHorizontal className="h-4 w-4 shrink-0 opacity-50 " />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80">
        <h3 className="text-lg font-semibold mb-4">Options</h3>
        <div className="mb-4 flex justify-between items-center">
          <FiltersDropdown />
          <label className="block text-sm font-medium mb-1" htmlFor="filter">
            Sort by
          </label>
          <SortDropdown />
        </div>
        {/* <div className="mb-4">
          <Button variant="default">Add Filter</Button>
        </div> */}
        <div className="flex items-center justify-between mb-6">
          <Switch id="needs-revisions" />
        </div>
        <div className="flex justify-between">
          <Button variant="default">Apply</Button>
          <Button variant="secondary">Clear Filters</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
