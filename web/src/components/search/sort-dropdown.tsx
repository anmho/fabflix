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
  SortField,
  SortState,
} from "./sort-dropdown.types";

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

const sortSelectItems: {
  type: SortActionType;
  label: string;
  field: SortField;
}[] = [
  {
    type: SortActionType.RATING_ASC,
    label: "Rating (highest first)",
    field: "rating",
  },
  {
    type: SortActionType.RATING_DESC,
    label: "Rating (lowest first)",
    field: "rating",
  },
  {
    type: SortActionType.TITLE_ASC,
    label: "Title (A to Z)",
    field: "title",
  },
  {
    type: SortActionType.TITLE_DESC,
    label: "Title (Z to A)",
    field: "title",
  },
  {
    type: SortActionType.YEAR_ASC,
    label: "Release Year (newest first)",
    field: "year",
  },
  {
    type: SortActionType.YEAR_DESC,
    label: "Release Year (oldest first)",
    field: "year",
  },
];

interface SortDropdownProps {
  initDimensions?: SortDimension[];
}

export const SortDropdown: React.FC = ({
  initDimensions,
}: SortDropdownProps) => {
  const [sortState, dispatch] = useReducer(
    sortReducer,
    createInitialState(initDimensions)
  );

  const handleCheckedChange = (checked: Checked, type: SortActionType) => {
    dispatch({ checked, type });
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
        {sortSelectItems.map((item) => (
          <SortMenuItem
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
        <div className="px-2 py-2">
          {/* {state.dimensions.map((dim) => {}} */}
          {/* <Badge className="m-1">Year</Badge> */}
          <Badge className="m-1">Rating</Badge>
          <Badge className="m-1">Title</Badge>
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

function isOptionChecked(state: SortState, sortAction: SortActionType) {
  return state.dimensions.find((dim) => dim.type === sortAction) !== undefined;
}

function isFieldSelected(state: SortState, field: SortField) {
  return state.dimensions.find((dim) => dim.field === field) !== undefined;
}

function createInitialState(
  initDimensions: SortDimension[] | undefined
): SortState {
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
}

function sortReducer(state: SortState, action: SortAction) {
  const dimension = SortDimensionMapping[action.type];
  console.log(state);

  if (isOptionChecked(state, action.type)) {
    return {
      dimensions: state.dimensions.filter((dim) => dim.type !== action.type),
      inputState: {
        ...state.inputState,
        [action.type]: { checked: false },
      },
    };
  }

  return {
    dimensions: [...state.dimensions, dimension],
    inputState: {
      ...state.inputState,
      [action.type]: { checked: true },
    },
  };
}

// field is selected but its not this one
