import { z } from "zod";

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

  public get type() {
    if (this.field === "title") {
      return this.order === "asc"
        ? SortActionEnum.TITLE_ASC
        : SortActionEnum.TITLE_DESC;
    } else if (this.field === "rating") {
      return this.order === "asc"
        ? SortActionEnum.RATING_ASC
        : SortActionEnum.RATING_DESC;
    } else {
      return this.order === "asc"
        ? SortActionEnum.YEAR_ASC
        : SortActionEnum.YEAR_DESC;
    }
  }
  // field1:asc,field2:desc
  public static parse(sortString: string) {
    const [field, order] = sortString.split(":");

    const params = MovieSortDimensionSchema.parse({
      field,
      order,
    });

    return new MovieSortDimension(params.field, params.order);
  }
  public toString() {
    return `${this.field}:${this.order}`;
  }
}
