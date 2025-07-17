import GenericForm, { type Config } from "../../Forms/GenericForm";
import { ProductFilterSchema } from "../../../models/Product";
import type { FieldValues } from "react-hook-form";

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
