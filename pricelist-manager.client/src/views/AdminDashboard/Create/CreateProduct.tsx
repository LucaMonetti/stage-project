import FormButton from "../../../components/Buttons/FormButton";
import GenericForm, {
  type Config,
} from "../../../components/Forms/GenericForm";

import { FaPlus } from "react-icons/fa6";
import {
  CreateProductSchema,
  type CreateProduct,
} from "../../../models/FormProduct";
import { useGet } from "../../../hooks/useGenericFetch";
import { PricelistArraySchema } from "../../../models/Pricelist";

const CreateProductForm = () => {
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
            fetchData: useGet({
              endpoint: "pricelists",
              method: "GET",
              schema: PricelistArraySchema,
            }),
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

  return (
    <div className="pb-4 px-8">
      <header className="flex justify-between items-center sticky top-[65.6px] bg-gray-900 z-50 py-4 border-gray-800 border-b-2">
        <div>
          <h1 className="text-3xl text-medium">Aggiungi un nuovo prodotto</h1>
          <p className="text-gray-400">
            Inserisci i dettagli del nuovo prodotto
          </p>
        </div>

        <FormButton formId="create-product-form" color="purple" Icon={FaPlus} />
      </header>

      <GenericForm
        schema={CreateProductSchema}
        className="mt-4"
        config={config}
        id="create-product-form"
        method={"POST"}
      />
    </div>
  );
};

export default CreateProductForm;
