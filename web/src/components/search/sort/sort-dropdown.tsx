"use client";

import * as React from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ArrowDownWideNarrow } from "lucide-react";
import { useReducer } from "react";
import { Checked } from "./sort-dropdown.types";
import {
  createInitSortState,
  isFieldSelected,
  isOptionChecked,
  sortReducer,
} from "./state";
import {
  MovieSortDimension,
  MovieSortField,
  SortActionEnum,
} from "./dimensions";
import { cn } from "~/lib/utils";
import { useTheme } from "next-themes";

interface SortDropdownProps {
  initDimensions?: MovieSortDimension[];
  applySort: (dimensions: MovieSortDimension[]) => void;
}

const menuItems: {
  type: SortActionEnum;
  field: MovieSortField;
  label: string;
}[] = [
  {
    type: SortActionEnum.TITLE_DESC,
    field: "title",
    label: "Title (Z to A)",
  },
  {
    type: SortActionEnum.TITLE_ASC,
    field: "title",
    label: "Title (A to Z)",
  },
  {
    type: SortActionEnum.RATING_DESC,
    field: "rating",
    label: "Rating (High to Low)",
  },
  {
    type: SortActionEnum.RATING_ASC,
    field: "rating",
    label: "Rating (Low to High)",
  },
  {
    type: SortActionEnum.YEAR_DESC,
    field: "year",
    label: "Release Year (Newest First)",
  },
  {
    type: SortActionEnum.YEAR_ASC,
    field: "year",
    label: "Release Year (Oldest First)",
  },
];
export const SortDropdown: React.FC<SortDropdownProps> = ({
  initDimensions,
  applySort,
}: SortDropdownProps) => {
  const [sortState, dispatch] = useReducer(
    sortReducer,
    createInitSortState(initDimensions ?? [])
  );

  const { theme } = useTheme();
  const handleCheckedChange = (checked: Checked, type: SortActionEnum) => {
    dispatch({ checked, type });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      applySort(sortState.dimensions);
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            theme,
            "flex justify-center items-center bg-background text-foreground"
          )}
        >
          <ArrowDownWideNarrow className="h-4 w-4 shrink-0 opacity-50 " />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn(
          theme,
          "w-56 bg-background text-popover-foreground border-border"
        )}
      >
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {menuItems.map((item, i) => (
          <SortMenuItem
            key={i}
            checked={isOptionChecked(sortState, item.type)}
            label={item.label}
            disabled={
              !isOptionChecked(sortState, item.type) &&
              isFieldSelected(sortState, item.field)
            }
            handleOnCheckedChange={(check) => {
              handleCheckedChange(check, item.type);
            }}
          />
        ))}
        <div className="px-2 pt-1 w-full h-10">
          {sortState.dimensions.map((dim, i) => (
            <Badge className="m-1" key={i}>
              {dim.field.slice(0, 1).toUpperCase() + dim.field.slice(1)}
            </Badge>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface SortMenuItemProps {
  checked: Checked;
  disabled?: boolean;
  label: string;
  handleOnCheckedChange: (checked: Checked) => void;
}

const SortMenuItem: React.FC<SortMenuItemProps> = ({
  checked,
  disabled,
  handleOnCheckedChange,
  label,
}: SortMenuItemProps) => {
  return (
    <DropdownMenuCheckboxItem
      checked={checked}
      disabled={disabled ?? false}
      onSelect={(e) => e.preventDefault()}
      onCheckedChange={handleOnCheckedChange}
    >
      {label}
    </DropdownMenuCheckboxItem>
  );
};

// field is selected but its not this one
