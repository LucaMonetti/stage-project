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
import { use, useEffect, useState, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useCreateUpdateList } from "../../../hooks/updatelists/useMutationUpdateList";
import {
  useAllProductsPaginated,
  useAllProductsByCompany,
} from "../../../hooks/products/useQueryProducts";
import { useAuth } from "../../../components/Authentication/AuthenticationProvider";
import type { UseQueryResult } from "@tanstack/react-query";
import { useAllCompanies } from "../../../hooks/companies/useQueryCompanies";
import { useNavigate } from "react-router";

const CreateUpdatelistForm = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const companies = useAllCompanies();

  let config = {
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
          {
            id: "companyId",
            label: "Azienda",
            ...(isAdmin()
              ? {
                  type: "searchable",
                  fetchData: companies,
                  schema: "company",
                  registerOptions: {
                    required: "Necessario selezionare un'azienda!",
                  },
                }
              : { type: "text" }),
            placeholder: "Seleziona l'azienda",
            isDisabled: !isAdmin(),
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
        <GenericForm<CreateUpdateList>
          schema={CreateUpdateListSchema}
          className="mt-4"
          config={config}
          id="create-updatelist-form"
          method={"POST"}
          externalProvider={true}
          mutation={mutation}
          values={{
            name: "",
            description: "",
            companyId: user?.company.id ?? "",
            products: [],
          }}
          onSuccess={() => {
            navigate("/dashboard/pricelists");
          }}
        />
        <ProductTable companyId={user?.company.id} />
      </GenericFormProvider>
    </div>
  );
};

function ProductTable({ companyId }: { companyId?: string }) {
  const [selectedItem, setSelectedItem] = useState<Product[]>([]);
  const methods = useFormContext<CreateUpdateList>();

  let products: UseQueryResult<Product[], Error>;

  if (companyId) {
    products = useAllProductsByCompany(companyId);
  } else {
    products = useAllProductsPaginated();
  }

  useEffect(() => {
    methods.setValue(
      "products",
      selectedItem.map((item) => item.id) // Assuming you want to store only the IDs of the selected products
    );
  }, [selectedItem, methods]);

  return (
    <GenericTableView
      data={products.data || []}
      isPending={products.isPending}
      isError={products.isError}
      error={products.error}
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
