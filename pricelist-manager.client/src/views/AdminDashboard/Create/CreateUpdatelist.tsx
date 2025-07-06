import FormButton from "../../../components/Buttons/FormButton";
import GenericForm, {
  type Config,
} from "../../../components/Forms/GenericForm";

import { FaPlus } from "react-icons/fa6";
import { useGet } from "../../../hooks/useGenericFetch";
import { CompanyArraySchema } from "../../../models/Company";
import {
  CreateUpdateListSchema,
  type CreateUpdateList,
} from "../../../models/FormUpdateList";
import { ProductArraySchema } from "../../../models/Product";

const CreateUpdatelistForm = () => {
  const products = useGet({
    endpoint: "products",
    method: "GET",
    schema: ProductArraySchema,
  });

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
      {
        title: "Prodotti",
        inputs: [
          {
            id: "products",
            label: "Prodotti",
            type: "searchable",
            placeholder: "Seleziona i prodotti",
            fetchData: useGet({
              endpoint: "products",
              method: "GET",
              schema: ProductArraySchema,
            }),
            schema: "product",
            registerOptions: {
              required: "Necessario selezionare un prodotto!",
              setValueAs: (value) => {
                console.log(value);
                return [value];
              },
            },
          },
        ],
      },
    ],
    endpoint: "updatelists",
  } satisfies Config<CreateUpdateList>;

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

      <GenericForm
        schema={CreateUpdateListSchema}
        className="mt-4"
        config={config}
        id="create-updatelist-form"
        method={"POST"}
      />
    </div>
  );
};

export default CreateUpdatelistForm;
