import { z } from "zod/v4";

export const CompanyLiteSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  postalCode: z.string(),
  province: z.string(),
  phone: z.string(),
  logoUri: z.string(),
  interfaceColor: z.string().startsWith("#"),
});

export const CompanyLiteArraySchema = z.array(CompanyLiteSchema);

export type CompanyLite = z.infer<typeof CompanyLiteSchema>;
