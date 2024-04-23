import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

export enum SortActionType {
  TITLE_DESC,
  TITLE_ASC,
  RATING_DESC,
  RATING_ASC,
  YEAR_DESC,
  YEAR_ASC,
}

export type SortField = "title" | "rating" | "year";

export interface SortDimension {
  field: SortField;
  order: "asc" | "desc";
  type: SortActionType;
}
export interface SortSelectState {
  checked: boolean;
}

export interface SortState {
  dimensions: SortDimension[];
  inputState: {
    [key in SortActionType]?: SortSelectState;
  };
}
export type Checked = DropdownMenuCheckboxItemProps["checked"];

export interface SortAction {
  type: SortActionType;
  checked: Checked;
}
