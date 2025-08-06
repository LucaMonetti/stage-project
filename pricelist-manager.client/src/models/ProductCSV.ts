import { z } from "zod/v4";

// Base schema for CSV file upload
export const BaseCsvSchema = z.object({
  csvFile: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, {
      message: "Please select a CSV file",
    })
    .transform((files) => files[0]),
});

export type BaseCSV = z.infer<typeof BaseCsvSchema>;

// Schema for Product CSV
export const ProductCSVSchema = BaseCsvSchema.extend({});

export type ProductCSV = z.infer<typeof ProductCSVSchema>;

// Schema for Updatelist CSV
export const UpdateListCSVSchema = BaseCsvSchema.extend({});

export type UpdateListCSV = z.infer<typeof UpdateListCSVSchema>;
