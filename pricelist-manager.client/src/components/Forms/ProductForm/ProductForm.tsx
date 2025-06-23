import { CreateProductSchema } from "../../../models/Product";
import Fieldset from "../Fieldset";
import Input from "../Input";
import SearchableSelect from "../SearchableSelect";
import Textarea from "../Textarea";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
  className?: string;
  id?: string;
};

export type ProductFormData = {
  pricelistId: string;
  productCode: string;
  name: string;
  description: string;
  price: number;
};

const ProductForm = ({ className, id }: Props) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(CreateProductSchema),
  });

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    try {
      const endpoint = `/api/pricelists/products`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();

      console.log(res);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form
      className={`flex flex-col gap-4 ${className}`}
      method="POST"
      id={id}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Fieldset name="Informazioni Generali">
        <SearchableSelect<ProductFormData> id="pricelistId" control={control} />
        <Input
          type="text"
          id="productCode"
          label="Codice Articolo"
          register={register}
        />
      </Fieldset>
      <Fieldset name="Informazioni Articolo">
        <Input
          type="text"
          id="name"
          label="Nome Articolo"
          register={register}
        />
        <Input
          type="number"
          id="price"
          label="Prezzo Articolo"
          register={register}
          registerOptions={{ valueAsNumber: true }}
        />
        <Textarea
          id="description"
          label="Descrizione Articolo"
          register={register}
        />
      </Fieldset>
    </form>
  );
};

export default ProductForm;
