import { z } from "zod";

const StarParamsSchema = z.object({
  id: z.string().nullable(),
  name: z.string(),
  birthYear: z.number().nullable(),
});

export type StarParams = z.infer<typeof StarParamsSchema>;

export { StarParamsSchema };
