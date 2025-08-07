import FormButton from "../../../components/Buttons/FormButton";
import GenericForm, {
  type Config,
} from "../../../components/Forms/GenericForm";

import { FaPlus } from "react-icons/fa6";
import {
  ChangePasswordSchema,
  EditUserSchema,
  type ChangePassword,
  type EditUser,
} from "../../../models/FormUser";
import { useNavigate, useParams } from "react-router";
import { useUser } from "../../../hooks/users/useQueryUsers";
import { useEditUserPassword } from "../../../hooks/users/useMutationUsers";
import { useAuth } from "../../../components/Authentication/AuthenticationProvider";
import { useEffect } from "react";

const EditUserPasswordForm = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();

  const config = {
    fieldset: [
      {
        title: "Cambio Password",
        inputs: [
          {
            id: "id",
            label: "ID",
            type: "hidden",
            isDisabled: true,
          },
          {
            id: "oldPassword",
            label: "Vecchia Password",
            type: "password",
            placeholder: "Inserire la vecchia password dell'Utente.",
            registerOptions: {
              required: "Necessario inserire la vecchia password dell'Utente.",
            },
          },
          {
            id: "newPassword",
            label: "Nuova Password",
            type: "password",
            placeholder: "Inserire una nuova password per l'Utente.",
            registerOptions: {
              required: "Necessario inserire una nuova password.",
            },
          },
          {
            id: "confirmPassword",
            label: "Conferma Nuova Password",
            type: "password",
            placeholder: "Confermare la nuova password per l'Utente.",
            registerOptions: {
              required: "Necessario confermare la nuova password.",
            },
          },
        ],
      },
    ],
    endpoint: "accounts",
  } satisfies Config<ChangePassword>;

  let data: ChangePassword | undefined = undefined;

  const { userId } = useParams();
  const editUser = useUser(userId ?? "");
  const mutation = useEditUserPassword();

  if (editUser.data) {
    data = {
      id: editUser.data.id,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
  }

  useEffect(() => {
    if (!(isAdmin() || user?.id === editUser.data?.id)) navigate("/auth/login");
  }, [isAdmin, user, editUser.data]);

  return (
    <div className="pb-4 px-8">
      <header className="flex justify-between items-center sticky top-[65.6px] bg-gray-900 z-20 py-4 border-gray-800 border-b-2">
        <div>
          <h1 className="text-3xl text-medium">Modifica password</h1>
          <p className="text-gray-400">
            Inserisci la password per l'Utente{" "}
            <span className="text-white font-medium">
              {editUser.data?.username}
            </span>
          </p>
        </div>

        <FormButton
          formId="edit-user-password-form"
          color="purple"
          Icon={FaPlus}
          text="Modifica"
        />
      </header>

      <GenericForm
        schema={ChangePasswordSchema}
        values={data}
        className="mt-4"
        config={{ ...config, endpoint: `accounts/${userId}/password` }}
        id="edit-user-password-form"
        method={"PUT"}
        mutation={mutation}
        onSuccess={() => {
          navigate("/dashboard/users/" + userId);
        }}
      />
    </div>
  );
};

export default EditUserPasswordForm;
