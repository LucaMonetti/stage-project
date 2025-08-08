import { FaPlus } from "react-icons/fa6";
import ActionRenderer from "../../../components/Buttons/ActionRenderer";
import GenericTableView from "../../../components/Dashboard/Tables/GenericTableView";
import {
  type Pricelist,
  type PricelistFilter,
} from "../../../models/Pricelist";
import { useEffect, useState } from "react";
import type { ColumnDef, Table } from "@tanstack/react-table";
import type { Config } from "../../../components/Forms/GenericForm";
import { useAllPricelistsPaginated } from "../../../hooks/pricelists/useQueryPricelists";
import { useDebounce } from "../../../hooks/useDebounce";
import { useAllCompanies } from "../../../hooks/companies/useQueryCompanies";

const PricelistListView = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<PricelistFilter>({});
  const [nameInput, setNameInput] = useState("");

  const debouncedNameInput = useDebounce(nameInput, 800);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      name: debouncedNameInput || undefined,
    }));
    setCurrentPage(1);
  }, [debouncedNameInput]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleFilterChange = (newFilters: Partial<PricelistFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const pricelists = useAllPricelistsPaginated(
    {
      CurrentPage: currentPage,
      PageSize: pageSize,
    },
    filters
  );
  const companies = useAllCompanies();
  const [_, setTable] = useState<Table<Pricelist>>();

  const filterConfig = {
    fieldset: [
      {
        title: "Filtri",
        inputs: [
          {
            id: "name",
            label: "Nome",
            type: "text",
            placeholder: "Inserire il nome del listino",
            autocomplete: false,
            outerClass: "flex-1",
            onChange: (e) => {
              setNameInput(e.target.value);
            },
          },
          {
            id: "company_id",
            label: "Codice Azienda",
            type: "searchable",
            placeholder: "Selezionare codice azienda...",
            fetchData: companies,
            schema: "company",
            onChange: (value) => {
              handleFilterChange({ company_id: value || undefined });
            },
          },
        ],
      },
    ],
    endpoint: "products",
  } satisfies Config<PricelistFilter>;

  const columns: ColumnDef<Pricelist>[] = [
    {
      accessorKey: "company.id",
      header: "Azienda",
      meta: {
        mobileLabel: "Azienda",
        className: "text-gray-500",
      },
    },
    {
      accessorKey: "name",
      header: "Nome Listino",
      meta: {
        mobileLabel: "Code",
      },
    },
    {
      accessorKey: "description",
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
      accessorKey: "products",
      header: "Totale Prodotti",
      cell: ({ getValue }) => {
        const value = getValue() as any[];
        return (
          <span className="text-blue-400">
            {value.length} {value.length === 1 ? "prodotto" : "prodotti"}
          </span>
        );
      },
    },
  ];

  return (
    <div className="px-8 py-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl text-medium">Listini</h1>
          <p className="text-gray-400">
            Visualizza tutti i listini registrati all'interno della piattaforma.
          </p>
        </div>
        <ActionRenderer
          actions={[
            {
              color: "blue",
              Icon: FaPlus,
              route: `/dashboard/create/pricelists`,
              type: "link",
            },
          ]}
        />
      </div>

      <GenericTableView
        data={pricelists.data?.items ?? []}
        isPending={pricelists.isPending}
        isError={pricelists.isError}
        error={pricelists.error}
        columns={columns}
        onTableReady={setTable}
        filterConfig={filterConfig}
        config={{
          baseUrl: "/dashboard/pricelists/:pid",
          enableLink: true,
          columnId: { ":pid": "id" },
        }}
        keyField="id"
        pagination={pricelists.data?.pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default PricelistListView;
