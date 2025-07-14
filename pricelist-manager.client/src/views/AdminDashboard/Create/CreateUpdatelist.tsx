import FormButton from "../../../components/Buttons/FormButton";

import { FaPlus } from "react-icons/fa6";
import { useGet } from "../../../hooks/useGenericFetch";
import { CompanyArraySchema } from "../../../models/Company";
import {
  CreateUpdateListSchema,
  type CreateUpdateList,
} from "../../../models/FormUpdateList";
import { ProductArraySchema, type Product } from "../../../models/Product";
import GenericForm, {
  GenericFormProvider,
  type Config,
} from "../../../components/Forms/GenericForm";
import GenericTableView from "../../../components/Dashboard/Tables/GenericTableView";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useCreateUpdateList } from "../../../hooks/updatelists/useMutationUpdateList";
import { useAllProducts } from "../../../hooks/products/useQueryProducts";

const CreateUpdatelistForm = () => {
  const config = {
    fieldset: [
      {
        title: "Informazioni Generali",
        inputs: [
          {
            id: "name",
            label: "Nome",
            type: "text",
            placeholder: "Inserisci il nome del listino",
            registerOptions: {
              required: "Necessario inserire il nome della lista.",
            },
          },
          {
            id: "description",
            label: "Descrizione Lista",
            type: "textarea",
            placeholder: "Inserire la descrizione.",
          },
        ],
      },
    ],
    endpoint: "updatelists",
  } satisfies Config<CreateUpdateList>;

  const mutation = useCreateUpdateList();

  return (
    <div className="pb-4 px-8">
      <header className="flex justify-between items-center sticky top-[65.6px] bg-gray-900 z-50 py-4 border-gray-800 border-b-2">
        <div>
          <h1 className="text-3xl text-medium">
            Crea una nuova lista di aggiornamento
          </h1>
          <p className="text-gray-400">Inserisci i dettagli della lista</p>
        </div>

        <FormButton
          formId="create-updatelist-form"
          color="purple"
          Icon={FaPlus}
        />
      </header>

      <GenericFormProvider schema={CreateUpdateListSchema}>
        <GenericForm
          schema={CreateUpdateListSchema}
          className="mt-4"
          config={config}
          id="create-updatelist-form"
          method={"POST"}
          externalProvider={true}
          mutation={mutation}
        />
        <ProductTable />
      </GenericFormProvider>
    </div>
  );
};

function ProductTable() {
  const [selectedItem, setSelectedItem] = useState<Product[]>([]);
  const methods = useFormContext<CreateUpdateList>();

  const { data, isPending, isError, error } = useAllProducts();

  useEffect(() => {
    methods.setValue(
      "products",
      selectedItem.map((item) => item.id) // Assuming you want to store only the IDs of the selected products
    );
  }, [selectedItem, methods]);

  return (
    <GenericTableView
      data={data || []}
      isPending={isPending}
      isError={isError}
      error={error}
      keyField="id"
      config={{
        enableLink: false,
        baseUrl: "/dashboard/products",
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
}

export default CreateUpdatelistForm;
