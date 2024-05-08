import { z } from "zod";

const GenreParamsSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
});

export type GenreParams = z.infer<typeof GenreParamsSchema>;

export { GenreParamsSchema };
