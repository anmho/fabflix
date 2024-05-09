import { z } from "zod";

const StarParamsSchema = z.object({
  id: z
    .string()
    .nullable()
    .transform((val) => {
      if (!val) return null;
      return val.trim();
    }),
  name: z.string().transform((val) => (val ? val.trim() : null)),
  birthYear: z.number().nullable().optional(),
});

export type StarParams = z.infer<typeof StarParamsSchema>;

export { StarParamsSchema };

// "use client"

// import { Icons } from "@/components/icons"
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
