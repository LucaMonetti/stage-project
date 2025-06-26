import { z } from "zod/v4";

// Product Statistics
export const ProductStatisticsSchema = z.object({
  totalRegistered: z.int(),
  uniqueCount: z.int(),
});

export type ProductStatistics = z.infer<typeof ProductStatisticsSchema>;
