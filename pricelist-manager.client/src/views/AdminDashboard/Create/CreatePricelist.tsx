import FormButton from "../../../components/Buttons/FormButton";
import GenericForm, {
  type Config,
} from "../../../components/Forms/GenericForm";

import { FaPlus } from "react-icons/fa6";
import {
  CreatePricelistSchema,
  type CreatePricelist,
} from "../../../models/FormPricelist";
import { useGet } from "../../../hooks/useGenericFetch";
import { CompanyArraySchema, type Company } from "../../../models/Company";
import { useCreatePricelist } from "../../../hooks/pricelists/useMutationPricelists";
import { useAuth } from "../../../components/Authentication/AuthenticationProvider";
import type { UseQueryResult } from "@tanstack/react-query";
import {
  useAllCompanies,
  useCompany,
} from "../../../hooks/companies/useQueryCompanies";
import { useNavigate } from "react-router";

const CreatePricelistForm = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const companies = useAllCompanies();

  const config = {
    fieldset: [
      {
        title: "Informazioni Articolo",
        inputs: [
          {
            id: "name",
            label: "Nome",
            type: "text",
            placeholder: "Inserisci il nome del listino",
            registerOptions: {
              required: "Necessario inserire il nome del Listino.",
            },
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
          {
            id: "description",
            label: "Descrizione Listino",
            type: "textarea",
            placeholder: "Inserire la descrizione dell'Listino.",
          },
        ],
      },
    ],
    endpoint: "pricelists",
  } satisfies Config<CreatePricelist>;

  const mutation = useCreatePricelist();

  return (
    <div className="pb-4 px-8">
      <header className="flex justify-between items-center sticky top-[65.6px] bg-gray-900 z-50 py-4 border-gray-800 border-b-2">
        <div>
          <h1 className="text-3xl text-medium">Aggiungi un nuovo Listino</h1>
          <p className="text-gray-400">
            Inserisci i dettagli del nuovo Listino
          </p>
        </div>

        <FormButton
          formId="create-pricelist-form"
          color="purple"
          Icon={FaPlus}
        />
      </header>

      <GenericForm<CreatePricelist>
        schema={CreatePricelistSchema}
        className="mt-4"
        config={config}
        id="create-pricelist-form"
        method={"POST"}
        mutation={mutation}
        {...(!isAdmin()
          ? {
              values: {
                name: "",
                description: "",
                companyId: user?.company.id ?? "",
              },
            }
          : {})}
        onSuccess={() => {
          navigate("/dashboard/pricelists");
        }}
      />
    </div>
  );
};

export default CreatePricelistForm;
