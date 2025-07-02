import { FaPlus } from "react-icons/fa6";
import ActionRenderer from "../../../components/Buttons/ActionRenderer";
import GenericTableView, {
  type CustomColumnDef,
} from "../../../components/Dashboard/Tables/GenericTableView";
import { useFetch } from "../../../hooks/useFetch";
import { useGet } from "../../../hooks/useGenericFetch";
import {
  CompanyArraySchema,
  type Company,
  type CompanyFilter,
} from "../../../models/Company";
import { useState } from "react";
import type { Table } from "@tanstack/react-table";
import type { Config } from "../../../components/Forms/GenericForm";

const CompanyListView = () => {
  const companies = useGet({
    method: "GET",
    endpoint: "companies",
    schema: CompanyArraySchema,
  });
  const [table, setTable] = useState<Table<Company>>();

  const columns: CustomColumnDef<Company>[] = [
    {
      accessorKey: "id",
      header: "Codice Azienda",
      meta: {
        className: "text-gray-500",
      },
    },
    {
      accessorKey: "name",
      header: "Ragione Sociale",
    },
    {
      accessorKey: "phone",
      header: "Contatto Telefonico",
      linkUrl: (item) => `tel:${item.phone}`,
    },
    {
      accessorKey: "pricelists",
      header: "Totale Listini",
      cell: ({ getValue }) => {
        const value = getValue() as any[];
        return (
          <span className="text-blue-500">
            {value.length ?? 0} {value.length === 1 ? "listino" : "listini"}
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
          <span className="text-blue-500">
            {value.length ?? 0} {value.length === 1 ? "prodotto" : "prodotti"}
          </span>
        );
      },
    },
  ];

  const filterConfig = {
    fieldset: [
      {
        title: "Filtri",
        inputs: [
          {
            id: "name",
            label: "Nome",
            type: "text",
            placeholder: "Inserire il nome",
            autocomplete: false,
            outerClass: "flex-1",
            onChange: (e) => {
              table?.getColumn("name")?.setFilterValue(e.target.value);
            },
          },
        ],
      },
    ],
    endpoint: "products",
  } satisfies Config<CompanyFilter>;

  return (
    <div className="px-8 py-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl text-medium">Aziende</h1>
          <p className="text-gray-400">
            Visualizza tutte le aziende registrate all'interno della
            piattaforma.
          </p>
        </div>
        <ActionRenderer
          actions={[
            {
              color: "blue",
              Icon: FaPlus,
              route: `/admin-dashboard/create/companies`,
            },
          ]}
        />
      </div>
      <GenericTableView
        data={companies}
        columns={columns}
        onTableReady={setTable}
        filterConfig={filterConfig}
        config={{
          baseUrl: "/admin-dashboard/companies/:pid",
          enableLink: true,
          columnId: { ":pid": "id" },
        }}
        keyField="id"
      />
    </div>
  );
};

export default CompanyListView;
