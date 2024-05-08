import { z } from "zod";
import { Genre } from "./genre";
import { Star } from "./star";
import { StarParams } from "~/api/stars";

export interface Movie {
  id: string;
  title: string;
  year: number;
  director: string;
  genres: Genre[];
  stars: Star[];
  rating: number;
  quantity: number;
  price: number;
}

export interface MovieList {
  movies: Movie[];
  total: number;
}

export enum SortActionEnum {
  TITLE_DESC,
  TITLE_ASC,
  RATING_DESC,
  RATING_ASC,
  YEAR_DESC,
  YEAR_ASC,
}

export type MovieSortField = "title" | "rating" | "year";
export type SortOrder = "asc" | "desc";

const MovieSortDimensionSchema = z.object({
  field: z.enum(["title", "rating", "year"]),
  order: z.enum(["asc", "desc"]),
});

export class MovieSortDimension {
  public constructor(public field: MovieSortField, public order: SortOrder) {}
  public static parse(sortString: string) {
    const [field, order] = sortString.split(":");

    const params = MovieSortDimensionSchema.parse({
      field,
      order,
    });

    return new MovieSortDimension(params.field, params.order);
  }
  public toString(): string {
    // console.log("Stringing ", `${this.field}:${this.order}`);
    return `${this.field}:${this.order}`;
  }
}
