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
import { useReducer, useState } from "react";
import {
  Checked,
  SortAction,
  SortActionType,
  SortDimension,
  SortState,
} from "./sort-dropdown.types";

interface SortDropdownProps {
  initDimensions?: SortDimension[];
}

const SortDimensionMapping: {
  [key in SortActionType]: SortDimension;
} = {
  [SortActionType.TITLE_DESC]: {
    field: "title",
    order: "desc",
    type: SortActionType.TITLE_DESC,
  },
  [SortActionType.TITLE_ASC]: {
    field: "title",
    order: "asc",
    type: SortActionType.TITLE_ASC,
  },
  [SortActionType.RATING_DESC]: {
    field: "rating",
    order: "desc",
    type: SortActionType.RATING_DESC,
  },
  [SortActionType.RATING_ASC]: {
    field: "rating",
    order: "asc",
    type: SortActionType.RATING_ASC,
  },
  [SortActionType.YEAR_DESC]: {
    field: "year",
    order: "desc",
    type: SortActionType.YEAR_DESC,
  },
  [SortActionType.YEAR_ASC]: {
    field: "year",
    order: "asc",
    type: SortActionType.YEAR_ASC,
  },
} as const;

const optionIsChecked = (state: SortState, sortAction: SortActionType) => {
  return state.dimensions.find((dim) => dim.type === sortAction) !== undefined;
};

function sortReducer(state: SortState, action: SortAction) {
  console.log(state, action);

  const dimension = SortDimensionMapping[action.type];

  if (!optionIsChecked(state, action.type)) {
    return {
      dimensions: [...state.dimensions, dimension],
      inputState: {
        ...state.inputState,
        [action.type]: { checked: action.checked },
      },
    };
  }
  return state;
}

const sortItems = [
  {
    type: SortActionType.RATING_ASC,
    label: "Rating (highest first)",
  },
  {
    type: SortActionType.RATING_DESC,
    label: "Rating (lowest first)",
  },
  {
    type: SortActionType.TITLE_ASC,
    label: "Title (A to Z)",
  },
  {
    type: SortActionType.TITLE_DESC,
    label: "Title (Z to A)",
  },
  {
    type: SortActionType.YEAR_ASC,
    label: "Release Year (newest first)",
  },
  {
    type: SortActionType.YEAR_DESC,
    label: "Release Year (oldest first)",
  },
];
const createInitialState = (
  initDimensions: SortDimension[] | undefined
): SortState => {
  let state: SortState = {
    dimensions: [],
    inputState: {},
  };
  if (!initDimensions) return state;
  for (const dim of initDimensions) {
    state = {
      ...state,
      [dim.type]: { checked: true },
    };
  }

  state.dimensions = initDimensions;
  return state;
};

export function SortDropdown({ initDimensions }: SortDropdownProps) {
  const [sortState, dispatch] = useReducer(
    sortReducer,
    createInitialState(initDimensions)
  );

  const handleCheckedChange = (checked: Checked, type: SortActionType) => {
    if (!optionIsChecked(sortState, type)) {
      dispatch({ checked, type });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex justify-center items-center">
          <ArrowDownWideNarrow className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {sortItems.map((item) => (
          <SortMenuItem
            checked={optionIsChecked(sortState, item.type)}
            label={item.label}
            handleOnCheckedChange={(check) =>
              handleCheckedChange(check, item.type)
            }
          />
        ))}
        <div className="px-2 py-2">
          <Badge className="m-1">Rating</Badge>
          <Badge className="m-1">Title</Badge>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface SortMenuItemProps {
  checked: Checked;
  label: string;
  handleOnCheckedChange: (checked: Checked) => void;
}

function SortMenuItem({
  checked,
  handleOnCheckedChange,
  label,
}: SortMenuItemProps) {
  return (
    <DropdownMenuCheckboxItem
      checked={checked}
      onSelect={(e) => e.preventDefault()}
      onCheckedChange={handleOnCheckedChange}
    >
      {label}
    </DropdownMenuCheckboxItem>
  );
}
