import type { Table } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import GenericForm, { type Config } from "../../Forms/GenericForm";
import { PricelistArraySchema } from "../../../models/Pricelist";
import { useGet } from "../../../hooks/useGenericFetch";
import { CompanyArraySchema } from "../../../models/Company";

type Props<T> = {
  table: Table<T>;
};

const FilterSchema = z.object({
  productCode: z.string(),
  pricelist_name: z.string(),
  currentInstace_description: z.string(),
  companyId: z.string(),
});

function FilterRenderer<T>({ table }: Props<T>) {
  const config = {
    fieldset: [
      {
        title: "Filtri",
        inputs: [
          {
            id: "productCode",
            label: "Codice Prodotto",
            type: "text",
            placeholder: "Inserire il codice del prodotto",
            autocomplete: false,
            outerClass: "flex-1",
            onChange: (e) => {
              table.getColumn("productCode")?.setFilterValue(e.target.value);
            },
          },
          {
            id: "companyId",
            label: "Codice Azienda",
            type: "searchable",
            placeholder: "Selezionare codice azienda...",
            fetchData: useGet({
              endpoint: "companies",
              method: "GET",
              schema: CompanyArraySchema,
            }),
            schema: "company",
            onChange: (value) => {
              console.log("I'm changing!");
              table.getColumn("companyId")?.setFilterValue(value);
            },
          },
        ],
      },
    ],
    endpoint: "products",
  } satisfies Config<z.infer<typeof FilterSchema>>;

  return (
    <div className="mb-4">
      <GenericForm
        schema={FilterSchema}
        className="mt-4"
        config={config}
        isRow={true}
        id="create-product-form"
      />
    </div>
  );
}

export default FilterRenderer;
