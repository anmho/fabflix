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
import { useEffect, useReducer, useState } from "react";

import { cn } from "~/lib/utils";
import { useTheme } from "next-themes";
import { MovieSortDimension, SortActionEnum } from "~/interfaces/movie";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

interface SortDropdownProps {
  initDimensions: MovieSortDimension[];
  applySort: (dimensions: MovieSortDimension[]) => void;
}

export type Checked = DropdownMenuCheckboxItemProps["checked"];

export type SortDropdownState = {
  [key in SortActionEnum]: Checked;
};

export const SortDropdown: React.FC<SortDropdownProps> = ({
  initDimensions,
  applySort,
}: SortDropdownProps) => {
  const [dimensions, setDimensions] =
    useState<MovieSortDimension[]>(initDimensions);

  const { theme } = useTheme();
  const handleCheckedChange = (
    checked: Checked,
    dimension: MovieSortDimension
  ) => {
    if (checked) {
      setDimensions([...dimensions, dimension]);
    } else if (!checked) {
      setDimensions([
        ...dimensions.filter(
          (d) => !(d.field === dimension.field && d.order === dimension.order)
        ),
      ]);
    }
  };

  useEffect(() => {
    applySort(dimensions);
  }, [dimensions]);

  const isSelected = (dimension: MovieSortDimension) => {
    // it is in the list
    const found =
      dimensions.find(
        (d) => d.field === dimension.field && d.order === dimension.order
      ) !== undefined;
    return found;
  };
  const isDisabled = (dimension: MovieSortDimension) => {
    const field =
      dimensions.find((d) => d.field === dimension.field) !== undefined;
    const option = isSelected(dimension);
    console.log(field, option);
    return field && !option;
  };

  return (
    <DropdownMenu>
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
            checked={isSelected(item.dimension)}
            label={item.label}
            disabled={isDisabled(item.dimension)}
            handleOnCheckedChange={(check) => {
              handleCheckedChange(check, item.dimension);
            }}
          />
        ))}
        <div className="px-2 pt-1 w-full h-10">
          {dimensions.map((dim, i) => (
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

const menuItems: {
  dimension: MovieSortDimension;
  label: string;
}[] = [
  {
    dimension: new MovieSortDimension("title", "desc"),
    label: "Title (Z to A)",
  },
  {
    dimension: new MovieSortDimension("title", "asc"),
    label: "Title (A to Z)",
  },
  {
    dimension: new MovieSortDimension("rating", "desc"),
    label: "Rating (High to Low)",
  },
  {
    dimension: new MovieSortDimension("rating", "asc"),
    label: "Rating (Low to High)",
  },
  {
    dimension: new MovieSortDimension("year", "desc"),
    label: "Release Year (Newest First)",
  },
  {
    dimension: new MovieSortDimension("year", "asc"),
    label: "Release Year (Oldest First)",
  },
];
