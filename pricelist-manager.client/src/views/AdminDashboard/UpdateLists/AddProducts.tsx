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
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import GenericTableView from "../../../components/Dashboard/Tables/GenericTableView";
import { type Product, type ProductFilter } from "../../../models/Product";
import { useUpdateList } from "../../../hooks/updatelists/useQueryUpdatelists";
import {
  useEditUpdateListProducts,
  useUploadUpdateListProductsCsv,
} from "../../../hooks/updatelists/useMutationUpdateList";
import { useAvailableProducts } from "../../../hooks/products/useQueryProducts";
import { useDebounce } from "../../../hooks/useDebounce";
import BasicLoader from "../../../components/Loader/BasicLoader";
import { useAllPricelists } from "../../../hooks/pricelists/useQueryPricelists";
import CsvForm from "../../../components/Forms/CsvForm";
import {
  UpdateListCSVSchema,
  type UpdateListCSV,
} from "../../../models/ProductCSV";

const AddProductsForm = () => {
  const navigate = useNavigate();
  let data: AddProductsUpdateList | undefined = undefined;

  const { updateListId } = useParams();

  if (!updateListId) {
    navigate("/404");
    return;
  }

  const updatelist = useUpdateList(updateListId ?? "");
  const mutation = useEditUpdateListProducts();
  const csvMutation = useUploadUpdateListProductsCsv();

  if (updatelist.isPending) {
    return (
      <div>
        <BasicLoader />
      </div>
    );
  }

  const config = {
    fieldset: [],
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
        <ProductTable
          updatelistId={updatelist.data?.id ?? -1}
          companyId={updatelist.data?.companyId ?? ""}
        />
      </GenericFormProvider>

      <div className="my-8 flex items-center w-4/5 mx-auto">
        <hr className="flex-1 border-gray-700" />
        <span className="px-4 text-gray-400 text-sm">oppure</span>
        <hr className="flex-1 border-gray-700" />
      </div>

      <CsvForm<UpdateListCSV>
        id={updateListId ?? ""}
        schema={UpdateListCSVSchema}
        onSubmit={(data) => {
          csvMutation?.mutate(
            { updateListId, csvFile: data.csvFile },
            {
              onSuccess: () => {
                navigate(`/dashboard/updatelists/${updateListId}`);
              },
            }
          );
        }}
        downloadUrl="/csvTemplates/updatelist_import.csv"
      />
    </div>
  );
};

function ProductTable({
  updatelistId,
  companyId,
}: {
  updatelistId: number;
  companyId: string;
}) {
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

  const handleFilterChange = (newFilters: Partial<ProductFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const products = useAvailableProducts(
    updatelistId,
    {
      CurrentPage: currentPage,
      PageSize: pageSize,
    },
    filters
  );
  const methods = useFormContext<AddProductsUpdateList>();

  const pricelist = useAllPricelists({ company_id: companyId });

  const [selectedItem, setSelectedItem] = useState<Product[]>([]);

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
          id: "id",
          header: "ID",
          accessorFn: (item) => item.id,
        },
        {
          id: "name",
          header: "Name",
          accessorFn: (item) => item.currentInstance.name,
        },
        {
          id: "price",
          header: "Price",
          meta: {
            className: "font-medium text-green-600 whitespace-nowrap",
          },
          accessorFn: (row: Product) =>
            `${row.currentInstance.price.toFixed(2)} €`,
        },
        {
          id: "cost",
          header: "Costo",
          meta: {
            className: "font-medium text-red-600 whitespace-nowrap",
          },
          accessorFn: (row: Product) =>
            `${row.currentInstance.cost.toFixed(2)} €`,
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
      filterConfig={{
        fieldset: [
          {
            title: "Filtri Prodotti",
            inputs: [
              {
                id: "productCode",
                label: "Codice Prodotto",
                type: "text",
                placeholder: "Inserire il codice del prodotto",
                autocomplete: false,
                outerClass: "flex-1",
                onChange: (e) => {
                  setProductCodeInput(e.target.value);
                },
              },
              {
                id: "pricelistId",
                label: "Codice Listino",
                type: "searchable",
                fetchData: pricelist,
                schema: "pricelist",
                placeholder: "Seleziona il listino",
                onChange: (value: any) => {
                  handleFilterChange({ pricelist_id: value || undefined });
                },
              },
            ],
          },
        ],
        endpoint: "products",
      }}
    />
  );
}

export default AddProductsForm;
