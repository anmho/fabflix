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
  stars: z.array(StarParamsSchema),
  genres: z.array(GenreParamsSchema),
});
export type MovieParams = z.infer<typeof MovieParamsSchema>;

export { MovieParamsSchema };
