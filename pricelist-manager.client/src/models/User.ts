import { z } from "zod/v4";
import { CompanySchema } from "./Company";

// User
export const UserSchema = z.object({
  id: z.guid(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.email(),
  phone: z.string(),
  company: CompanySchema,
});

export type User = z.infer<typeof UserSchema>;

export const UserArrraySchema = z.array(UserSchema);

// User Statistics
export const UserStatisticsSchema = z.object({
  totalRegistered: z.int(),
  adminCount: z.int(),
  userCount: z.int(),
});

export type UserStatistics = z.infer<typeof UserStatisticsSchema>;
