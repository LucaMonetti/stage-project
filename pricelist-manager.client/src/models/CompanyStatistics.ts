import { z } from "zod/v4";

// Company statistics
export const CompanyStatisticsSchema = z.object({
  totalRegistered: z.int(),
});

export type CompanyStatistics = z.infer<typeof CompanyStatisticsSchema>;
