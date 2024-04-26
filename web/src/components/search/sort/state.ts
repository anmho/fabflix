import {
  MovieSortDimension,
  MovieSortField,
  SortActionEnum as MovieSortAction,
} from "./dimensions";
import { MovieSortState, SortAction } from "./sort-dropdown.types";

const SortDimensionMapping: {
  [key in MovieSortAction]: MovieSortDimension;
} = {
  [MovieSortAction.TITLE_DESC]: {
    field: "title",
    order: "desc",
    type: MovieSortAction.TITLE_DESC,
  },
  [MovieSortAction.TITLE_ASC]: {
    field: "title",
    order: "asc",
    type: MovieSortAction.TITLE_ASC,
  },
  [MovieSortAction.RATING_DESC]: {
    field: "rating",
    order: "desc",
    type: MovieSortAction.RATING_DESC,
  },
  [MovieSortAction.RATING_ASC]: {
    field: "rating",
    order: "asc",
    type: MovieSortAction.RATING_ASC,
  },
  [MovieSortAction.YEAR_DESC]: {
    field: "year",
    order: "desc",
    type: MovieSortAction.YEAR_DESC,
  },
  [MovieSortAction.YEAR_ASC]: {
    field: "year",
    order: "asc",
    type: MovieSortAction.YEAR_ASC,
  },
} as const;

export function isOptionChecked(
  state: MovieSortState,
  sortAction: MovieSortAction
) {
  return state.dimensions.find((dim) => dim.type === sortAction) !== undefined;
}

export function isFieldSelected(state: MovieSortState, field: MovieSortField) {
  return state.dimensions.find((dim) => dim.field === field) !== undefined;
}

export function createInitSortState(
  initDimensions: MovieSortDimension[] | undefined
): MovieSortState {
  let state: MovieSortState = {
    dimensions: [],
    inputState: {},
  };
  if (!initDimensions) return state;
  console.log("initDimensions", initDimensions);
  for (const dim of initDimensions) {
    console.log("dim", dim);
    state = {
      ...state,
      inputState: {
        [dim.type]: { checked: true },
      },
    };
  }

  state.dimensions = initDimensions;
  return state;
}

export function sortReducer(
  state: MovieSortState,
  action: SortAction
): MovieSortState {
  const dimension = SortDimensionMapping[action.type];
  // console.log(state);

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
