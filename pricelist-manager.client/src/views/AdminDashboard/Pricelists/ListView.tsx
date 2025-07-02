import { FaPlus } from "react-icons/fa6";
import ActionRenderer from "../../../components/Buttons/ActionRenderer";
import GenericTableView from "../../../components/Dashboard/Tables/GenericTableView";
import { useFetch } from "../../../hooks/useFetch";
import {
  PricelistArraySchema,
  type Pricelist,
  type PricelistFilter,
} from "../../../models/Pricelist";
import { useGet } from "../../../hooks/useGenericFetch";
import { useState } from "react";
import type { ColumnDef, Table } from "@tanstack/react-table";
import { CompanyArraySchema } from "../../../models/Company";
import type { Config } from "../../../components/Forms/GenericForm";

const PricelistListView = () => {
  const pricelists = useGet({
    method: "GET",
    endpoint: "pricelists",
    schema: PricelistArraySchema,
  });
  const [table, setTable] = useState<Table<Pricelist>>();

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
              table?.getColumn("name")?.setFilterValue(e.target.value);
            },
          },
          {
            id: "company_id",
            label: "Codice Azienda",
            type: "searchable",
            placeholder: "Selezionare codice azienda...",
            fetchData: useGet({
              endpoint: "companies",
              method: "GET",
              schema: CompanyArraySchema,
            }),
            schema: "company",
            onChange: (value) => {
              table?.getColumn("company_id")?.setFilterValue(value);
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
    // {
    //   accessorKey: "id",
    //   header: "Listino",
    //   meta: {
    //     mobileLabel: "Pricelist",
    //     className: "text-gray-500",
    //   },
    // },
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
              route: `/admin-dashboard/create/pricelists`,
            },
          ]}
        />
      </div>

      <GenericTableView
        data={pricelists}
        columns={columns}
        onTableReady={setTable}
        filterConfig={filterConfig}
        config={{
          baseUrl: "/admin-dashboard/pricelists/:pid",
          enableLink: true,
          columnId: { ":pid": "id" },
        }}
        keyField="id"
      />
    </div>
  );
};

export default PricelistListView;
