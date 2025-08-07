import FormButton from "../../../components/Buttons/FormButton";
import { FaPlus } from "react-icons/fa6";
import {
  EditUpdateListSchema,
  type EditUpdateList,
} from "../../../models/FormUpdateList";
import GenericForm, {
  type Config,
} from "../../../components/Forms/GenericForm";
import { useNavigate, useParams } from "react-router";
import { useUpdateList } from "../../../hooks/updatelists/useQueryUpdatelists";
import { useEditUpdateList } from "../../../hooks/updatelists/useMutationUpdateList";
import { useAuth } from "../../../components/Authentication/AuthenticationProvider";
import { useEffect } from "react";

const EditUpdatelistForm = () => {
  let data: EditUpdateList | undefined = undefined;

  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const { updateListId } = useParams();
  const updatelist = useUpdateList(updateListId ?? "");
  const mutation = useEditUpdateList();

  const config = {
    fieldset: [
      {
        title: "Informazioni Generali",
        inputs: [
          {
            id: "id",
            label: "Id",
            type: "hidden",
            isDisabled: true,
          },
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
    ],
    endpoint: "updatelists",
  } satisfies Config<EditUpdateList>;

  if (updatelist.data) {
    data = {
      id: updatelist.data.id.toString(),
      name: updatelist.data.name,
      description: updatelist.data.description,
    };
  }

  useEffect(() => {
    if (!(isAdmin() || user?.company.id === updatelist.data?.companyId))
      navigate("/auth/login");
  }, [isAdmin, user, updatelist.data]);

  return (
    <div className="pb-4 px-8">
      <header className="flex justify-between items-center sticky top-[65.6px] bg-gray-900 z-20 py-4 border-gray-800 border-b-2">
        <div>
          <h1 className="text-3xl text-medium">
            Modifica la lista di aggiornamento
          </h1>
          <p className="text-gray-400">Inserisci i dettagli della lista</p>
        </div>

        <FormButton
          formId="edit-updatelist-form"
          color="purple"
          text="Aggiorna"
          Icon={FaPlus}
          disabled={updatelist.isLoading}
        />
      </header>

      <GenericForm
        schema={EditUpdateListSchema}
        className="mt-4"
        values={data}
        config={{ ...config, endpoint: `updatelists/${updateListId}` }}
        id="edit-updatelist-form"
        method={"PUT"}
        mutation={mutation}
        onSuccess={() => {
          navigate("/dashboard/updatelists/" + updateListId);
        }}
      />
    </div>
  );
};

export default EditUpdatelistForm;
