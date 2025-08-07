import FormButton from "../../../components/Buttons/FormButton";
import GenericForm, {
  type Config,
} from "../../../components/Forms/GenericForm";

import { FaPlus } from "react-icons/fa6";
import { EditUserSchema, type EditUser } from "../../../models/FormUser";
import { useNavigate, useParams } from "react-router";
import { useUser } from "../../../hooks/users/useQueryUsers";
import { useEditUser } from "../../../hooks/users/useMutationUsers";
import { useAuth } from "../../../components/Authentication/AuthenticationProvider";
import { useEffect } from "react";

const EditUserForm = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();

  const config = {
    fieldset: [
      {
        title: "Informazioni Generali",
        inputs: [
          {
            id: "companyId",
            label: "Codice Azienda",
            type: "text",
            isDisabled: true,
            placeholder: "Inserire il dell'Azienda per cui lavora l'utente.",
          },
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
        ],
      },
    ],
    endpoint: "accounts",
  } satisfies Config<EditUser>;

  let data: EditUser | undefined = undefined;

  const { userId } = useParams();
  const editUser = useUser(userId ?? "");
  const mutation = useEditUser();

  if (editUser.data) {
    data = {
      id: editUser.data.id,
      companyId: editUser.data.company.id,
      email: editUser.data.email,
      firstName: editUser.data.firstName,
      lastName: editUser.data.lastName,
      phone: editUser.data.phone,
      username: editUser.data.username,
    };
  }

  useEffect(() => {
    if (!(isAdmin() || user?.id === editUser.data?.id)) navigate("/auth/login");
  }, [isAdmin, user, editUser.data]);

  return (
    <div className="pb-4 px-8">
      <header className="flex justify-between items-center sticky top-[65.6px] bg-gray-900 z-20 py-4 border-gray-800 border-b-2">
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
        mutation={mutation}
        onSuccess={() => {
          navigate("/dashboard/users/" + userId);
        }}
      />
    </div>
  );
};

export default EditUserForm;
