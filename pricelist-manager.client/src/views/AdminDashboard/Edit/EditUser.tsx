import FormButton from "../../../components/Buttons/FormButton";
import GenericForm, {
  type Config,
} from "../../../components/Forms/GenericForm";

import { FaPlus } from "react-icons/fa6";
import {
  CreateUserSchema,
  EditUserSchema,
  type CreateUser,
  type EditUser,
} from "../../../models/FormUser";
import { useParams } from "react-router";
import { useGet } from "../../../hooks/useGenericFetch";
import { UserSchema } from "../../../models/User";

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
          type: "text",
          placeholder: "Inserire il dell'Azienda per cui lavora l'utente.",
          registerOptions: {
            required: "Necessario inserire il codice dell'Azienda",
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
} satisfies Config<EditUser>;

const EditUserForm = () => {
  let data: EditUser | undefined = undefined;

  const { userId } = useParams();
  const user = useGet({
    endpoint: `accounts/${userId}`,
    method: "GET",
    schema: UserSchema,
  });

  if (user.data) {
    data = {
      id: user.data.id,
      companyId: user.data.company.id,
      email: user.data.email,
      firstName: user.data.firstName,
      lastName: user.data.lastName,
      phone: user.data.phone,
      role: user.data.roles,
      username: user.data.username,
      password: "",
    };

    console.log(data);
  }

  return (
    <div className="pb-4 px-8">
      <header className="flex justify-between items-center sticky top-[65.6px] bg-gray-900 z-50 py-4 border-gray-800 border-b-2">
        <div>
          <h1 className="text-3xl text-medium">Modifica un Account Utente</h1>
          <p className="text-gray-400">Inserisci i dettagli dell'Utente</p>
        </div>

        <FormButton
          formId="edit-user-form"
          color="purple"
          Icon={FaPlus}
          text="Modifica"
        />
      </header>

      <GenericForm
        schema={EditUserSchema}
        values={data}
        className="mt-4"
        config={{ ...config, endpoint: `accounts/${userId}` }}
        id="edit-user-form"
        method={"PUT"}
      />
    </div>
  );
};

export default EditUserForm;
