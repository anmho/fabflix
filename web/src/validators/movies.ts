import { EachYearOfIntervalOptions } from "date-fns";
import { z } from "zod";
import { StarParamsSchema } from "./stars";
import { GenreParamsSchema } from "./genres";

const MovieParamsSchema = z.object({
  title: z.string(),
  year: z.number(),
  director: z.string(),
  price: z.number(),
  rating: z.number().nullable(),
  stars: z.array(StarParamsSchema).min(1),
  genres: z.array(GenreParamsSchema).min(1),
});
export type MovieParams = z.infer<typeof MovieParamsSchema>;

export { MovieParamsSchema };
