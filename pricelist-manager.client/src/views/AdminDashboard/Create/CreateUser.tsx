import FormButton from "../../../components/Buttons/FormButton";
import GenericForm, {
  type Config,
} from "../../../components/Forms/GenericForm";

import { FaPlus } from "react-icons/fa6";
import { CreateUserSchema, type CreateUser } from "../../../models/FormUser";
import { useGet } from "../../../hooks/useGenericFetch";
import { CompanyArraySchema } from "../../../models/Company";
import { useCreateUser } from "../../../hooks/users/useMutationUsers";
import { useAuth } from "../../../components/Authentication/AuthenticationProvider";
import { useNavigate } from "react-router";
import { useAllCompanies } from "../../../hooks/companies/useQueryCompanies";

const CreateUserForm = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const companies = useAllCompanies();

  if (!isAdmin()) navigate("/auth/login");

  const config = {
    fieldset: [
      {
        title: "Informazioni Generali",
        inputs: [
          {
            id: "firstName",
            label: "Nome",
            type: "text",
            placeholder: "Inserire il nome dell'Utente.",
            registerOptions: {
              required: "Necessario inserire il nome dell'Utente.",
            },
          },
          {
            id: "lastName",
            label: "Cognome",
            type: "text",
            placeholder: "Inserire il cognome dell'Utente.",
            registerOptions: {
              required: "Necessario inserire il cognome dell'Utente.",
            },
          },
          {
            id: "companyId",
            label: "Codice Azienda",
            type: "searchable",
            fetchData: companies,
            schema: "company",
            placeholder: "Inserire il codice dell'azienda",
            registerOptions: {
              required: "Necessario inserire il codice dell'Azienda.",
            },
          },
          {
            id: "phone",
            label: "Numero telefonico",
            type: "text",
            placeholder: "Inserire il numero telefonico dell'Utente.",
            registerOptions: {
              required: "Necessario inserire il numero telefonico dell'Utente.",
            },
          },
        ],
      },
      {
        title: "Informazioni di Accesso",
        inputs: [
          {
            id: "username",
            label: "Username",
            type: "text",
            placeholder: "Inserire uno username per l'Utente.",
            registerOptions: {
              required: "Necessario inserire uno username per l'Utente.",
            },
          },
          {
            id: "email",
            label: "Email",
            type: "email",
            placeholder: "Inserire l'email dell'Utente.",
            registerOptions: {
              required: "Necessario inserire l'email dell'Utente.",
            },
          },
          {
            id: "password",
            label: "Password",
            type: "password",
            placeholder: "Inserire una password per l'Utente.",
            registerOptions: {
              required: "Necessario inserire una password.",
            },
          },
          {
            id: "role",
            label: "Ruolo",
            type: "text",
            placeholder: "Inserire un ruolo per l'Utente.",
            registerOptions: {
              required: "Necessario selezionare un ruolo.",
            },
          },
        ],
      },
    ],
    endpoint: "accounts/register",
  } satisfies Config<CreateUser>;

  const mutation = useCreateUser();

  return (
    <div className="pb-4 px-8">
      <header className="flex justify-between items-center sticky top-[65.6px] bg-gray-900 z-50 py-4 border-gray-800 border-b-2">
        <div>
          <h1 className="text-3xl text-medium">
            Aggiungi un nuovo Account Utente
          </h1>
          <p className="text-gray-400">Inserisci i dettagli del nuovo Utente</p>
        </div>

        <FormButton formId="create-user-form" color="purple" Icon={FaPlus} />
      </header>

      <GenericForm
        schema={CreateUserSchema}
        className="mt-4"
        config={config}
        id="create-user-form"
        method={"POST"}
        mutation={mutation}
        onSuccess={() => {
          navigate("/dashboard/pricelists");
        }}
      />
    </div>
  );
};

export default CreateUserForm;
