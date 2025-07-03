import { FaPlus } from "react-icons/fa6";
import ActionRenderer from "../../../components/Buttons/ActionRenderer";
import GenericTableView from "../../../components/Dashboard/Tables/GenericTableView";
import { useGet } from "../../../hooks/useGenericFetch";
import { useState } from "react";
import type { ColumnDef, Table } from "@tanstack/react-table";
import {
  UpdateListArraySchema,
  type UpdateList,
} from "../../../models/UpdateList";

const UpdateListListView = () => {
  const updatelists = useGet({
    method: "GET",
    endpoint: "updatelists",
    schema: UpdateListArraySchema,
  });
  const [table, setTable] = useState<Table<UpdateList>>();

  const columns: ColumnDef<UpdateList>[] = [
    {
      accessorKey: "name",
      header: "Lista di Aggiornamento",
    },
    {
      accessorKey: "totalProducts",
      header: "Prodotti",
    },
    // {
    //   accessorKey: "description",
    //   header: "Descrizione",
    //   meta: {
    //     className: "max-w-xs truncate",
    //   },
    //   cell: ({ getValue }) => {
    //     const value = getValue() as string;
    //     return (
    //       <span className="block truncate" title={value}>
    //         {value}
    //       </span>
    //     );
    //   },
    // },
    // {
    //   accessorKey: "products",
    //   header: "Totale Prodotti",
    //   cell: ({ getValue }) => {
    //     const value = getValue() as any[];
    //     return (
    //       <span className="text-blue-400">
    //         {value.length} {value.length === 1 ? "prodotto" : "prodotti"}
    //       </span>
    //     );
    //   },
    // },
  ];

  return (
    <div className="px-8 py-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl text-medium">Liste di aggiornamento</h1>
          <p className="text-gray-400">
            Visualizza tutti le liste di aggiornamento in corso.
          </p>
        </div>
        <ActionRenderer
          actions={[
            {
              color: "blue",
              Icon: FaPlus,
              route: `/admin-dashboard/create/updatelists`,
            },
          ]}
        />
      </div>

      <GenericTableView
        data={updatelists}
        columns={columns}
        onTableReady={setTable}
        config={{
          baseUrl: "/admin-dashboard/updatelists/:pid",
          enableLink: true,
          columnId: { ":pid": "id" },
        }}
        keyField="id"
      />
    </div>
  );
};

export default UpdateListListView;
