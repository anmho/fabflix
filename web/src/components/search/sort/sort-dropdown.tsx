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
import { StringToBoolean } from "class-variance-authority/types";

interface SortDropdownProps {
  initDimensions?: MovieSortDimension[];
}

export const SortDropdown: React.FC = ({
  initDimensions,
}: SortDropdownProps) => {
  const [sortState, dispatch] = useReducer(
    sortReducer,
    createInitSortState(initDimensions)
  );

  const handleCheckedChange = (checked: Checked, type: SortActionEnum) => {
    dispatch({ checked, type });
  };

  const handleOpenChange = (open: boolean) => {
    // apply filters on close if filters are different

    console.log(open);
  };

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

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex justify-center items-center">
          <ArrowDownWideNarrow className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {menuItems.map((item, i) => (
          <SortMenuItem
            key={i}
            checked={sortState.inputState[item.type]?.checked}
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