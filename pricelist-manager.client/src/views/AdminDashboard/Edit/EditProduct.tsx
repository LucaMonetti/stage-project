import { useParams, useSearchParams } from "react-router";
import FormButton from "../../../components/Buttons/FormButton";

import { FaPlus } from "react-icons/fa6";
import { useGet } from "../../../hooks/useGenericFetch";
import { ProductSchema } from "../../../models/Product";
import type { Config } from "../../../components/Forms/GenericForm";
import {
  EditProductSchema,
  type CreateProduct,
  type EditProduct,
} from "../../../models/FormProduct";
import GenericForm from "../../../components/Forms/GenericForm";
import {
  PricelistArraySchema,
  PricelistSchema,
} from "../../../models/Pricelist";

const EditProductForm = () => {
  let data: EditProduct | undefined = undefined;

  const { productId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const product = useGet({
    endpoint: `products/${productId}`,
    method: "GET",
    schema: ProductSchema,
  });

  const config = {
    fieldset: [
      {
        title: "Informazioni Generali",
        inputs: [
          {
            id: "pricelistId",
            label: "Listino",
            type: "searchable",
            isDisabled: true,
            schema: "pricelist",
            fetchData: useGet({
              endpoint: `pricelists`,
              method: "GET",
              schema: PricelistArraySchema,
            }),
            placeholder: "Seleziona il listino prezzi",
            registerOptions: {
              required: "Necessario selezionare un listino!",
            },
          },
          {
            id: "productCode",
            label: "Codice Prodotto",
            type: "text",
            isDisabled: true,
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
            id: "margin",
            label: "Marginalità",
            type: "number",
            placeholder: "Inserire la marginalità",
            registerOptions: {
              valueAsNumber: true,
              required: "Necessario inserire la marginalità.",
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
  } satisfies Config<EditProduct>;

  if (product.data) {
    data = {
      pricelistId: product.data.pricelistId,
      productCode: product.data.productCode,
      name: product.data.currentInstance.name,
      price: product.data.currentInstance.price,
      cost: product.data.currentInstance.cost,
      description: product.data.currentInstance.description,
      accountingControl: product.data.currentInstance.accountingControl ?? "",
      cda: product.data.currentInstance.cda ?? "",
      salesItem: product.data.currentInstance.salesItem ?? "",
      productId: productId ?? "",
      margin: product.data.currentInstance.margin ?? 1.0,
    };
  }

  return (
    <div className="pb-4 px-8">
      <header className="flex justify-between items-center sticky top-[65.6px] bg-gray-900 z-50 py-4 border-gray-800 border-b-2">
        <div>
          <h1 className="text-3xl text-medium">Modifica il prodotto</h1>
          <p className="text-gray-400">
            Inserisci i dettagli del che vuoi modificare prodotto
          </p>
        </div>

        <FormButton
          formId="edit-product-form"
          color="purple"
          text="Aggiorna"
          Icon={FaPlus}
          disabled={product.isLoading}
        />
      </header>

      <GenericForm<CreateProduct>
        id="edit-product-form"
        config={{
          ...config,
          endpoint: `products/${productId}${
            searchParams.get("editUpdateList") != null
              ? "?editUpdateList=" + searchParams.get("editUpdateList")
              : ""
          }`,
        }}
        schema={EditProductSchema}
        values={data}
        method="PUT"
      />
    </div>
  );
};

export default EditProductForm;
