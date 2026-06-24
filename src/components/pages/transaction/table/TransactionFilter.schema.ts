import { z } from "zod";

export const filterSchema = z.object({
  status: z.enum(["", "PENDING", "SUCCESS", "FAILED"]),
});

export type FilterValues = z.infer<typeof filterSchema>;

export type FilterableStatus = "" | "PENDING" | "SUCCESS" | "FAILED";
