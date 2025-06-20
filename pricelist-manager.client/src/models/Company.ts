import { z } from "zod/v4";

// Company
export const CompanySchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  postalCode: z.string(),
  province: z.string(),
  phone: z.string(),
  logoUri: z.url(),
  interfaceColor: z.string().startsWith("#"),
});

export const CompanyArraySchema = z.array(CompanySchema);

export type Company = z.infer<typeof CompanySchema>;

// Company statistics
export const CompanyStatisticsSchema = z.object({
  totalRegistered: z.int(),
});

export type CompanyStatistics = z.infer<typeof CompanyStatisticsSchema>;
