import { FaPlus } from "react-icons/fa6";
import ActionRenderer from "../../../components/Buttons/ActionRenderer";
import GenericTableView, {
  type CustomColumnDef,
} from "../../../components/Dashboard/Tables/GenericTableView";
import { type Product, type ProductFilter } from "../../../models/Product";
import { type Table } from "@tanstack/react-table";
import type { Config } from "../../../components/Forms/GenericForm";
import { useEffect, useState } from "react";
import { useAllProductsPaginated } from "../../../hooks/products/useQueryProducts";
import { useAllCompanies } from "../../../hooks/companies/useQueryCompanies";
import { useDebounce } from "../../../hooks/useDebounce";

const ProductsListView = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<ProductFilter>({});
  const [productCodeInput, setProductCodeInput] = useState("");

  const debouncedProductCode = useDebounce(productCodeInput, 800);

  // Add this useEffect to update filters when debouncedProductCode changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      productCode: debouncedProductCode || undefined,
    }));
    setCurrentPage(1);
  }, [debouncedProductCode]);

  const { data, isPending, isError, error } = useAllProductsPaginated(
    {
      CurrentPage: currentPage,
      PageSize: pageSize,
    },
    filters
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleFilterChange = (newFilters: Partial<ProductFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const companies = useAllCompanies();

  const [table, setTable] = useState<Table<Product>>();

  const columns: CustomColumnDef<Product>[] = [
    {
      accessorKey: "companyId",
      header: "Azienda",
      meta: {
        mobileLabel: "Azienda",
        className: "text-gray-500",
      },
    },
    {
      accessorKey: "pricelist.name",
      header: "Listino",
      meta: {
        mobileLabel: "Pricelist",
        className: "text-gray-500",
      },
    },
    {
      accessorKey: "productCode",
      header: "Codice Prodotto",
      meta: {
        mobileLabel: "Code",
      },
    },
    {
      accessorKey: "currentInstance.name",
      header: "Nome",
    },
    {
      accessorKey: "currentInstance.description",
      header: "Descrizione",
      meta: {
        className: "max-w-xs truncate",
      },
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return (
          <span className="block truncate" title={value}>
            {value}
          </span>
        );
      },
    },
    {
      accessorKey: "currentInstance.price",
      header: "Prezzo",
      meta: {
        className: "font-medium text-green-600 whitespace-nowrap",
      },
      accessorFn: (row: Product) => `${row.currentInstance.price.toFixed(2)} €`,
    },
    {
      accessorKey: "currentInstance.cost",
      header: "Costo",
      meta: {
        className: "font-medium text-red-600 whitespace-nowrap",
      },
      accessorFn: (row: Product) => `${row.currentInstance.cost.toFixed(2)} €`,
    },
  ];

  const filterConfig = {
    fieldset: [
      {
        title: "Filtri",
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
            id: "companyId",
            label: "Codice Azienda",
            type: "searchable",
            placeholder: "Selezionare codice azienda...",
            fetchData: companies,
            schema: "company",
            onChange: (value) => {
              handleFilterChange({ companyId: value || undefined });
            },
          },
        ],
      },
    ],
    endpoint: "products",
  } satisfies Config<ProductFilter>;

  return (
    <div className="px-8 py-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl text-medium">Prodotti</h1>
          <p className="text-gray-400">
            Visualizza tutti i prodotti registrati all'interno della
            piattaforma.
          </p>
        </div>
        <ActionRenderer
          actions={[
            {
              color: "blue",
              Icon: FaPlus,
              route: `/dashboard/create/products`,
              type: "link",
            },
          ]}
        />
      </div>

      <GenericTableView
        data={data?.items ?? []}
        isPending={isPending}
        isError={isError}
        error={error}
        columns={columns}
        config={{
          baseUrl: "/dashboard/products/:pid",
          enableLink: true,
          columnId: { ":pid": "id" },
        }}
        onTableReady={setTable}
        filterConfig={filterConfig}
        keyField="id"
        pagination={data?.pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default ProductsListView;
