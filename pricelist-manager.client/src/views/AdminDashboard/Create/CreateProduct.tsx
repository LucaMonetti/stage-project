import FormButton from "../../../components/Buttons/FormButton";
import GenericForm, {
  type Config,
} from "../../../components/Forms/GenericForm";

import { FaPlus } from "react-icons/fa6";
import {
  CreateProductSchema,
  type CreateProduct,
} from "../../../models/FormProduct";
import { type Pricelist } from "../../../models/Pricelist";
import {
  useCreateProduct,
  useUploadProductsCsv,
} from "../../../hooks/products/useMutationProduct";
import { useAllPricelists } from "../../../hooks/pricelists/useQueryPricelists";
import type { UseQueryResult } from "@tanstack/react-query";
import { useAuth } from "../../../components/Authentication/AuthenticationProvider";
import { useNavigate, useSearchParams } from "react-router";
import CsvForm from "../../../components/Forms/CsvForm";
import { ProductCSVSchema, type ProductCSV } from "../../../models/ProductCSV";

const CreateProductForm = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const pricelistId = searchParams.get("pricelistId");

  const csvMutation = useUploadProductsCsv();

  let pricelists: UseQueryResult<Pricelist[], Error>;

  if (isAdmin()) {
    pricelists = useAllPricelists();
  } else {
    pricelists = useAllPricelists({ company_id: user?.company.id ?? "" });
  }

  const config = {
    fieldset: [
      {
        title: "Informazioni Generali",
        inputs: [
          {
            id: "pricelistId",
            label: "Listino",
            type: "searchable",
            placeholder: "Seleziona il listino prezzi",
            fetchData: pricelists,
            schema: "pricelist",
            registerOptions: {
              required: "Necessario selezionare un listino!",
            },
          },
          {
            id: "productCode",
            label: "Codice Prodotto",
            type: "text",
            placeholder: "Inserire il codice del prodotto",
            registerOptions: {
              required: "Necessario inserire un codice Prodotto!",
            },
          },
        ],
      },
      {
        title: "Informazioni Articolo",
        inputs: [
          {
            id: "name",
            label: "Nome",
            type: "text",
            placeholder: "Inserisci il nome dell'Articolo",
            registerOptions: {
              required: "Necessario inserire il nome dell'Articolo.",
            },
          },
          {
            id: "margin",
            label: "Marginalità",
            type: "number",
            placeholder: "Inserire la marginalità",
            registerOptions: {
              valueAsNumber: true,
              required: "Necessario inserire la marginalità.",
            },
          },
          {
            id: "price",
            label: "Prezzo Articolo",
            type: "number",
            placeholder: "Inserire il prezzo dell'Articolo",
            registerOptions: {
              valueAsNumber: true,
              required: "Necessario inserire un prezzo Prodotto.",
            },
          },
          {
            id: "cost",
            label: "Costo Articolo",
            type: "number",
            placeholder: "Inserire il costo dell'Articolo",
            registerOptions: {
              valueAsNumber: true,
              required: "Necessario inserire il costo dell'Articolo.",
            },
          },
          {
            id: "description",
            label: "Descrizione Articolo",
            type: "textarea",
            placeholder: "Inserire la descrizione dell'Articolo.",
          },
        ],
      },
      {
        title: "Informazioni Contabili",
        inputs: [
          {
            id: "accountingControl",
            label: "Mastrino",
            type: "text",
            placeholder: "Inserisci il codice del mastrino.",
          },
          {
            id: "cda",
            label: "CDA",
            type: "text",
            placeholder: "Inserisci il codice CDA.",
          },
          {
            id: "salesItem",
            label: "Voce di vendita",
            type: "text",
            placeholder: "Inserisci il codice della voce di vendita.",
          },
        ],
      },
    ],
    endpoint: "products",
  } satisfies Config<CreateProduct>;

  const mutation = useCreateProduct();

  return (
    <div className="pb-4 px-8">
      <header className="flex justify-between items-center sticky top-[65.6px] bg-gray-900 z-20 py-4 border-gray-800 border-b-2">
        <div>
          <h1 className="text-3xl text-medium">Aggiungi un nuovo prodotto</h1>
          <p className="text-gray-400">
            Inserisci i dettagli del nuovo prodotto
          </p>
        </div>

        <FormButton
          isPending={mutation.isPending}
          formId="create-product-form"
          color="purple"
          Icon={FaPlus}
        />
      </header>

      <GenericForm
        schema={CreateProductSchema}
        className="mt-4"
        config={config}
        id="create-product-form"
        method={"POST"}
        mutation={mutation}
        values={{
          pricelistId: pricelistId ?? "",
          productCode: "",
          name: "",
          margin: 0,
          price: 0,
          cost: 0,
          description: "",
          accountingControl: "",
          cda: "",
          salesItem: "",
        }}
        onSuccess={() => {
          navigate("/dashboard/products");
        }}
      />
      {pricelistId && (
        <>
          <div className="my-8 flex items-center w-4/5 mx-auto">
            <hr className="flex-1 border-gray-700" />
            <span className="px-4 text-gray-400 text-sm">oppure</span>
            <hr className="flex-1 border-gray-700" />
          </div>

          <CsvForm<ProductCSV>
            id={pricelistId ?? ""}
            schema={ProductCSVSchema}
            onSubmit={(data) => {
              csvMutation?.mutate(
                { pricelistId, csvFile: data.csvFile },
                {
                  onSuccess: () => {
                    navigate(`/dashboard/pricelists/${pricelistId}`);
                  },
                }
              );
            }}
          />
        </>
      )}
    </div>
  );
};

export default CreateProductForm;
