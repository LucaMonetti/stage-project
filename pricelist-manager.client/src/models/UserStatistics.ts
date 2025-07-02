import { z } from "zod/v4";

// User Statistics
export const UserStatisticsSchema = z.object({
  totalRegistered: z.int(),
  adminCount: z.int(),
  userCount: z.int(),
});

export type UserStatistics = z.infer<typeof UserStatisticsSchema>;
