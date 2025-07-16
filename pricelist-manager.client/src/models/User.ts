import { z } from "zod/v4";
import { CompanyLiteSchema } from "./CompanyLite";

// User
export const UserSchema = z.object({
  id: z.guid(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.email(),
  phone: z.string(),
  roles: z.array(z.string()),
  company: CompanyLiteSchema,
});

export type User = z.infer<typeof UserSchema>;

export const UserArraySchema = z.array(UserSchema);

// User Statistics
export const UserStatisticsSchema = z.object({
  totalRegistered: z.int(),
  adminCount: z.int(),
  userCount: z.int(),
});

export type UserStatistics = z.infer<typeof UserStatisticsSchema>;

// User Statistics
export const UserFilterSchema = z.object({
  username: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  company_id: z.string().optional(),
});

export type UserFilter = z.infer<typeof UserFilterSchema>;
