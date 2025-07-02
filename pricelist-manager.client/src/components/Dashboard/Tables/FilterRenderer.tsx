import type { Table } from "@tanstack/react-table";
import { useForm, type FieldValues } from "react-hook-form";
import { z } from "zod/v4";
import GenericForm, { type Config } from "../../Forms/GenericForm";
import { PricelistArraySchema } from "../../../models/Pricelist";
import { useGet } from "../../../hooks/useGenericFetch";
import { CompanyArraySchema } from "../../../models/Company";
import { ProductFilterSchema } from "../../../models/Product";

type Props<T extends FieldValues> = {
  config: Config<T>;
};

function FilterRenderer<T extends FieldValues>({ config }: Props<T>) {
  return (
    <div className="mb-4">
      <GenericForm
        schema={ProductFilterSchema}
        className="mt-4"
        config={config}
        isRow={true}
        id="create-product-form"
      />
    </div>
  );
}

export default FilterRenderer;
