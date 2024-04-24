import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { MovieSortDimension, SortActionEnum } from "./dimensions";

export interface SortSelectState {
  checked: boolean;
}

export interface MovieSortState {
  dimensions: MovieSortDimension[];
  inputState: {
    [key in SortActionEnum]?: SortSelectState;
  };
}
export type Checked = DropdownMenuCheckboxItemProps["checked"];

export interface SortAction {
  type: SortActionEnum;
  checked: Checked;
}
