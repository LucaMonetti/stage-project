import FormButton from "../../../components/Buttons/FormButton";
import { FaPlus } from "react-icons/fa6";
import { useGet } from "../../../hooks/useGenericFetch";
import {
  AddProductsUpdateListSchema,
  type AddProductsUpdateList,
} from "../../../models/FormUpdateList";
import GenericForm, {
  GenericFormProvider,
  type Config,
} from "../../../components/Forms/GenericForm";
import { UpdateListSchema } from "../../../models/UpdateList";
import { useParams } from "react-router";
import { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import GenericTableView from "../../../components/Dashboard/Tables/GenericTableView";
import { ProductArraySchema, type Product } from "../../../models/Product";
import { useUpdateList } from "../../../hooks/updatelists/useQueryUpdatelists";
import { useEditUpdateListProducts } from "../../../hooks/updatelists/useMutationUpdateList";
import {
  useAllProducts,
  useAllProductsByCompany,
} from "../../../hooks/products/useQueryProducts";

const AddProductsForm = () => {
  let data: AddProductsUpdateList | undefined = undefined;

  const { updateListId } = useParams();
  const updatelist = useUpdateList(updateListId ?? "");
  const mutation = useEditUpdateListProducts();

  const config = {
    fieldset: [
      {
        title: "Informazioni Generali",
        inputs: [
          {
            id: "id",
            label: "Id",
            type: "text",
            isDisabled: true,
          },
        ],
      },
    ],
    endpoint: `updatelists/${updateListId}/products`,
  } satisfies Config<AddProductsUpdateList>;

  if (updatelist.data) {
    data = {
      id: updatelist.data.id.toString(),
      productIds: updatelist.data.products.map((product) =>
        product.id.toString()
      ),
    };
  }

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
          formId="edit-updatelist-form"
          color="purple"
          text="Aggiorna"
          Icon={FaPlus}
          disabled={updatelist.isLoading}
        />
      </header>
      <GenericFormProvider schema={AddProductsUpdateListSchema}>
        <GenericForm
          schema={AddProductsUpdateListSchema}
          className="mt-4"
          values={data}
          config={config}
          id="edit-updatelist-form"
          method={"POST"}
          externalProvider={true}
          mutation={mutation}
        />
        <ProductTable companyId={updatelist.data?.companyId ?? ""} />
      </GenericFormProvider>
    </div>
  );
};

function ProductTable({ companyId }: { companyId: string }) {
  const products = useAllProductsByCompany(companyId);

  console.log("Products data:", products, companyId);

  const [selectedItem, setSelectedItem] = useState<Product[]>([]);
  const isInitializedRef = useRef(false);
  const methods = useFormContext<AddProductsUpdateList>();

  // Initialize selectedItem with existing products from the form - run only once when both data sources are ready
  useEffect(() => {
    if (!products.data || isInitializedRef.current) return;

    // Get productIds from form values directly (without watching)
    const currentFormValues = methods.getValues();
    const formProductIds = currentFormValues.productIds || [];

    // Initialize selectedItem
    if (formProductIds.length > 0) {
      const existingProducts = products.data.filter((product) =>
        formProductIds.includes(product.id)
      );
      setSelectedItem(existingProducts);
      console.log(
        "Initialized selectedItem with existing products:",
        existingProducts
      );
    }
    isInitializedRef.current = true;
  }, [products, methods]);

  // Update form values when selectedItem changes (but not during initialization)
  useEffect(() => {
    if (!isInitializedRef.current) return; // Skip during initialization

    const selectedIds = selectedItem.map((item) => item.id);
    methods.setValue("productIds", selectedIds);

    // Debug: Log what we're sending
    console.log("Updated productIds in form:", selectedIds);
  }, [selectedItem, methods]);

  return (
    <GenericTableView
      data={products.data ?? []}
      error={products.error}
      isPending={products.isPending}
      isError={products.isError}
      keyField="id"
      config={{
        enableLink: false,
        baseUrl: "/dashboard/products",
        columnId: {},
      }}
      columns={[
        {
          id: "name",
          header: "Name",
          accessorFn: (item) => item.currentInstance.name,
        },
        {
          id: "price",
          header: "Price",
          accessorFn: (item) => item.currentInstance.price,
        },
        {
          id: "description",
          header: "Description",
          accessorFn: (item) => item.id,
        },
      ]}
      selectedItems={selectedItem}
      enableCheckbox={true}
      onRowSelect={(item) => {
        setSelectedItem((prev) => {
          if (prev.some((i) => i.id === item.id)) {
            return prev.filter((i) => i.id !== item.id);
          }
          return [...prev, item];
        });
      }}
    />
  );
}

export default AddProductsForm;
