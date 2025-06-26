import { CreateProductSchema } from "../../../models/CreateProduct";
import Fieldset from "../Fieldset";
import Input from "../Input";
import SearchableSelect from "../SearchableSelect";
import Textarea from "../Textarea";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import isEqual from "lodash.isequal";

type Props = {
  className?: string;
  id?: string;
  values?: ProductFormData;
};

export type ProductFormData = {
  pricelistId: string;
  productCode: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  cda: string;
  accountingControl: string;
  salesItem: string;
};

const ProductForm = ({ className, id, values }: Props) => {
  const {
    register,
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    mode: "all",
    resolver: zodResolver(CreateProductSchema),
  });
  const errorDiv = useRef<HTMLDivElement>(null);

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    let endpoint = `/api/pricelists/products`;
    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    if (values) {
      endpoint = `/api/pricelists/${values.pricelistId}/products/${values.productCode}`;
      options.method = "PUT";

      if (isEqual(values, data)) {
        console.log("Equals");
        return;
      }
    }

    try {
      const response = await fetch(endpoint, options);

      // More explicit status checking
      if (response.status >= 400) {
        const errorData = await response.json();
        handleBackendErrors(errorData);
        return;
      }

      const res = await response.json();

      console.log(res);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleBackendErrors = (errorData: any) => {
    // Handle field-specific errors
    if (errorData.error) {
      Object.keys(errorData.errors).forEach((field) => {
        setError(field as keyof ProductFormData, {
          message: errorData.errors[field][0], // Assuming array of messages
        });
      });
    }

    // Handle general/root errors
    if (errorData.message) {
      setError("root", { message: errorData.message });
    }

    if (errors.root) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (values) {
      reset(values);
    }
  }, [values]);

  return (
    <form
      className={`flex flex-col gap-4 ${className}`}
      method="POST"
      id={id}
      onSubmit={handleSubmit(onSubmit)}
    >
      {errors.root && (
        <div
          className="border-2 border-red-700 rounded p-8 bg-red-950"
          ref={errorDiv}
        >
          <p className="text-red-50">{errors.root.message}</p>
        </div>
      )}
      <Fieldset name="Informazioni Generali">
        <SearchableSelect<ProductFormData>
          id="pricelistId"
          control={control}
          error={errors["pricelistId"]?.message}
          registerOptions={{
            required: "Necessario selezionare un listino!",
          }}
          prevValue={values ? values.pricelistId : undefined}
        />
        <Input
          type="text"
          id="productCode"
          label="Codice Articolo"
          register={register}
          error={errors["productCode"]?.message}
          registerOptions={{
            required: "Necessario inserire il codice del prodotto!",
          }}
          value={values ? values.productCode : undefined}
        />
      </Fieldset>
      <Fieldset name="Informazioni Articolo">
        <Input
          type="text"
          id="name"
          label="Nome Articolo"
          register={register}
          error={errors["name"]?.message}
          registerOptions={{
            required: "Necessario inserire il nome dell'Articolo!",
          }}
          value={values ? values.name : undefined}
        />
        <Input
          type="number"
          id="price"
          label="Prezzo Articolo"
          register={register}
          registerOptions={{
            valueAsNumber: true,
            required: "Necessario inserire il prezzo dell'Articolo!",
          }}
          error={errors["price"]?.message}
          value={values ? values.price : undefined}
        />
        <Input
          type="number"
          id="cost"
          label="Costo Articolo"
          register={register}
          registerOptions={{
            valueAsNumber: true,
            required: "Necessario inserire il costo dell'Articolo!",
          }}
          error={errors["cost"]?.message}
          value={values ? values.cost : undefined}
        />
        <Textarea
          id="description"
          label="Descrizione Articolo"
          register={register}
          error={errors["description"]?.message}
          value={values ? values.description : undefined}
        />
      </Fieldset>
      <Fieldset name="Informazioni Contabili">
        <Input
          type="text"
          id="name"
          label="Mastrino"
          register={register}
          error={errors["accountingControl"]?.message}
          value={values ? values.accountingControl : undefined}
        />
        <Input
          type="text"
          id="name"
          label="CDA"
          register={register}
          error={errors["cda"]?.message}
          value={values ? values.name : undefined}
        />
        <Input
          type="text"
          id="name"
          label="Voce vendita"
          register={register}
          error={errors["salesItem"]?.message}
          value={values ? values.salesItem : undefined}
        />
      </Fieldset>
    </form>
  );
};

export default ProductForm;
