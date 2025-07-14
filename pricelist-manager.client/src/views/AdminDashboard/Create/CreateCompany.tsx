import FormButton from "../../../components/Buttons/FormButton";
import GenericForm, {
  type Config,
} from "../../../components/Forms/GenericForm";

import { FaPlus } from "react-icons/fa6";
import {
  CreateCompanySchema,
  type CreateCompany,
} from "../../../models/FormCompany";
import { useCreateCompany } from "../../../hooks/companies/useMutationCompanies";
import { useAuth } from "../../../components/Authentication/AuthenticationProvider";
import { useNavigate } from "react-router";

const CreateCompanyForm = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin()) navigate("/auth/login");

  const config = {
    fieldset: [
      {
        title: "Informazioni Generali",
        inputs: [
          {
            id: "id",
            label: "Codice Azienda",
            type: "text",
            placeholder: "Inserire il Codice dell'Azienda",
            registerOptions: {
              required: "Necessario inserire il codice dell'Azienda!",
            },
          },
          {
            id: "name",
            label: "Ragione Sociale",
            type: "text",
            placeholder: "Inserire la Ragione Sociale dell'Azienda.",
            registerOptions: {
              required: "Necessario inserire la Ragione Sociale!",
            },
          },
        ],
      },
      {
        title: "Informazioni di contatto",
        inputs: [
          {
            id: "phone",
            label: "Contatto Telefonico",
            type: "text",
            placeholder:
              "Inserire il numero telefonico (Formato Internazionale)",
            registerOptions: {
              required:
                "Necessario inserire il numero telefonico dell'Azienda!",
            },
          },
          {
            id: "address",
            label: "Indirizzo",
            type: "text",
            placeholder: "Inserire l'indirizzo dell'Azienda",
            registerOptions: {
              required: "Necessario inserire l'indirizzo dell'Azienda!",
            },
          },
          {
            id: "province",
            label: "Provincia",
            type: "text",
            placeholder: "Inserire la provincia dell'Azienda.",
            registerOptions: {
              required: "Necessario inserire la provincia dell'Azienda!",
            },
          },
          {
            id: "postalCode",
            label: "Codice Postale",
            type: "text",
            placeholder: "Inserisci il codice postale dell'Azienda",
            registerOptions: {
              required: "Necessario inserire il codice postale dell'Azienda!",
            },
          },
        ],
      },
      {
        title: "Personalizzazione Interfaccia",
        inputs: [
          {
            id: "logoUri",
            label: "Indirizzo Logo Azienda",
            type: "url",
          },
          {
            id: "interfaceColor",
            label: "Colore Interfaccia",
            type: "color",
          },
        ],
      },
    ],
    endpoint: "companies",
  } satisfies Config<CreateCompany>;

  const mutation = useCreateCompany();

  return (
    <div className="pb-4 px-8">
      <header className="flex justify-between items-center sticky top-[65.6px] bg-gray-900 z-50 py-4 border-gray-800 border-b-2">
        <div>
          <h1 className="text-3xl text-medium">Aggiungi una nuova Azienda</h1>
          <p className="text-gray-400">
            Inserisci i dettagli della nuova Azienda
          </p>
        </div>

        <FormButton formId="create-company-form" color="purple" Icon={FaPlus} />
      </header>

      <GenericForm
        schema={CreateCompanySchema}
        className="mt-4"
        config={config}
        id="create-company-form"
        method={"POST"}
        mutation={mutation}
      />
    </div>
  );
};

export default CreateCompanyForm;
