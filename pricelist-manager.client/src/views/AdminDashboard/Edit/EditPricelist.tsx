import FormButton from "../../../components/Buttons/FormButton";
import GenericForm, {
  type Config,
} from "../../../components/Forms/GenericForm";

import { FaPlus } from "react-icons/fa6";
import {
  EditPricelistSchema,
  type EditPricelist,
} from "../../../models/FormPricelist";
import { useNavigate, useParams } from "react-router";
import { useGet } from "../../../hooks/useGenericFetch";
import { CompanyArraySchema } from "../../../models/Company";
import { usePricelist } from "../../../hooks/pricelists/useQueryPricelists";
import { useEditPricelist } from "../../../hooks/pricelists/useMutationPricelists";

const EditPricelistForm = () => {
  const navigate = useNavigate();

  const config = {
    fieldset: [
      {
        title: "Informazioni Articolo",
        inputs: [
          {
            id: "id",
            label: "ID",
            type: "text",
            isDisabled: true,
          },
          {
            id: "companyId",
            label: "Codice Azienda",
            type: "text",
            isDisabled: true,
          },
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
            id: "description",
            label: "Descrizione Listino",
            type: "textarea",
            placeholder: "Inserire la descrizione dell'Listino.",
          },
        ],
      },
    ],
    endpoint: "pricelists",
  } satisfies Config<EditPricelist>;

  let data: EditPricelist | undefined = undefined;

  const { pricelistId } = useParams();
  const pricelist = usePricelist(pricelistId ?? "");
  const mutation = useEditPricelist();

  if (pricelist.data) {
    data = {
      id: pricelist.data.id,
      companyId: pricelist.data?.company.id,
      name: pricelist.data?.name,
      description: pricelist.data?.description,
    };
  }

  return (
    <div className="pb-4 px-8">
      <header className="flex justify-between items-center sticky top-[65.6px] bg-gray-900 z-50 py-4 border-gray-800 border-b-2">
        <div>
          <h1 className="text-3xl text-medium">Modifica il Listino</h1>
          <p className="text-gray-400">Inserisci i dettagli del Listino</p>
        </div>

        <FormButton
          formId="create-pricelist-form"
          color="purple"
          text="Modifica"
          Icon={FaPlus}
        />
      </header>

      <GenericForm
        schema={EditPricelistSchema}
        values={data}
        className="mt-4"
        config={{ ...config, endpoint: `pricelists/${pricelistId}` }}
        id="create-pricelist-form"
        method={"PUT"}
        mutation={mutation}
        onSuccess={() => {
          navigate("/dashboard/pricelists/" + pricelistId);
        }}
      />
    </div>
  );
};

export default EditPricelistForm;
