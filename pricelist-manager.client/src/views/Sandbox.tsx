import {
  FormProvider,
  useForm,
  useFormContext,
  type FieldValues,
  type SubmitHandler,
} from "react-hook-form";
import {
  CreateUpdateListSchema,
  type CreateUpdateList,
} from "../models/FormUpdateList";
import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "../components/Buttons/FormButton";
import type z from "zod/v4";
import GenericTableView from "../components/Dashboard/Tables/GenericTableView";
import { useGet } from "../hooks/useGenericFetch";
import { ProductArraySchema, type Product } from "../models/Product";
import { useEffect, useState } from "react";

type InferredZodSchema<T extends FieldValues> = z.ZodType<T, any, any>;

const Sandbox = () => {
  return <Providers<CreateUpdateList> schema={CreateUpdateListSchema} />;
};

const Providers = <T extends FieldValues>({
  schema,
}: {
  schema: InferredZodSchema<T>;
}) => {
  const methods = useForm<T>({
    mode: "all",
    resolver: zodResolver(schema),
  });

  return (
    <FormProvider {...methods}>
      <FormComponent<T> />
      <Table />
    </FormProvider>
  );
};

const FormComponent = <T extends FieldValues>() => {
  const methods = useFormContext<T>();
  const handleOnSubmit: SubmitHandler<T> = (data) => {
    console.log("Form result:", data);
  };

  return (
    <>
      <FormButton color="blue" formId="test-form" />
      <form
        className={`flex flex-col gap-4`}
        onSubmit={methods.handleSubmit(handleOnSubmit)}
        method={"POST"}
        id={"test-form"}
      >
        <label htmlFor="name">Test label</label>
        <input {...methods.register("name" as any)} />
        <input
          placeholder="Description"
          {...methods.register("description" as any)}
        />
      </form>
    </>
  );
};

const Table = () => {
  const methods = useFormContext<CreateUpdateList>();

  const [selectedItem, setSelectedItem] = useState<Product[]>([]);

  useEffect(() => {
    methods.setValue(
      "products",
      selectedItem.map((item) => item.id) // Assuming you want to store only the IDs of the selected products
    );
  }, [selectedItem, methods]);

  return (
    <GenericTableView
      data={useGet({
        endpoint: "products",
        method: "GET",
        schema: ProductArraySchema,
      })}
      keyField="id"
      config={{
        enableLink: false,
        baseUrl: "/admin-dashboard/products",
        columnId: {},
      }}
      columns={[
        {
          id: "name",
          header: "Name",
          accessorFn: (item) => item.currentInstance.name,
        },
        {
          id: "price",
          header: "Price",
          accessorFn: (item) => item.currentInstance.price,
        },
        {
          id: "description",
          header: "Description",
          accessorFn: (item) => item.id,
        },
      ]}
      selectedItems={selectedItem}
      enableCheckbox={true}
      onRowSelect={(item) => {
        setSelectedItem((prev) => {
          if (prev.some((i) => i.id === item.id)) {
            return prev.filter((i) => i.id !== item.id);
          }
          return [...prev, item];
        });
      }}
    />
  );
};

export default Sandbox;
