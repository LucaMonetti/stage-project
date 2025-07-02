import { z } from "zod/v4";

// Pricelist Statistics
export const PricelistStatisticsSchema = z.object({
  totalRegistered: z.int(),
});

export type PricelistStatistics = z.infer<typeof PricelistStatisticsSchema>;
