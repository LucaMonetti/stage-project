import FormButton from "../../../components/Buttons/FormButton";
import { FaPlus } from "react-icons/fa6";
import {
  AddProductsUpdateListSchema,
  type AddProductsUpdateList,
} from "../../../models/FormUpdateList";
import GenericForm, {
  GenericFormProvider,
  type Config,
} from "../../../components/Forms/GenericForm";
import { useParams } from "react-router";
import { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import GenericTableView from "../../../components/Dashboard/Tables/GenericTableView";
import { type Product, type ProductFilter } from "../../../models/Product";
import { useUpdateList } from "../../../hooks/updatelists/useQueryUpdatelists";
import { useEditUpdateListProducts } from "../../../hooks/updatelists/useMutationUpdateList";
import {
  useAllProductsByCompany,
  useAllProductsPaginated,
  useAvailableProducts,
} from "../../../hooks/products/useQueryProducts";
import { useDebounce } from "../../../hooks/useDebounce";
import BasicLoader from "../../../components/Loader/BasicLoader";

const AddProductsForm = () => {
  let data: AddProductsUpdateList | undefined = undefined;

  const { updateListId } = useParams();
  const updatelist = useUpdateList(updateListId ?? "");
  const mutation = useEditUpdateListProducts();

  if (updatelist.isPending) {
    return (
      <div>
        <BasicLoader />
      </div>
    );
  }

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
      productIds: [],
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
        <ProductTable updatelistId={updatelist.data?.id ?? -1} />
      </GenericFormProvider>
    </div>
  );
};

function ProductTable({ updatelistId }: { updatelistId: number }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<ProductFilter>({});
  const [productCodeInput, setProductCodeInput] = useState("");

  const debouncedProductCode = useDebounce(productCodeInput, 800);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      productCode: debouncedProductCode || undefined,
    }));
    setCurrentPage(1);
  }, [debouncedProductCode]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const products = useAvailableProducts(
    updatelistId,
    {
      CurrentPage: currentPage,
      PageSize: pageSize,
    },
    filters
  );

  const [selectedItem, setSelectedItem] = useState<Product[]>([]);
  const methods = useFormContext<AddProductsUpdateList>();

  useEffect(() => {
    const selectedIds = selectedItem.map((item) => item.id);
    methods.setValue("productIds", selectedIds);
  }, [selectedItem, methods]);

  return (
    <GenericTableView
      data={products.data?.items ?? []}
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
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      pagination={products.data?.pagination}
    />
  );
}

export default AddProductsForm;
