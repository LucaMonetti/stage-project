import { z } from "zod/v4";

export const ProductCSVSchema = z.object({
  csvFile: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, {
      message: "Please select a CSV file",
    })
    .transform((files) => files[0]),
});

export type ProductCSV = z.infer<typeof ProductCSVSchema>;
