import { FaCheck, FaPlus, FaTrash } from "react-icons/fa6";
import ActionRenderer, {
  type Action,
} from "../../../components/Buttons/ActionRenderer";
import GenericTableView, {
  type CustomColumnDef,
} from "../../../components/Dashboard/Tables/GenericTableView";
import { useGet, usePost } from "../../../hooks/useGenericFetch";
import { useState } from "react";
import type { ColumnDef, Table } from "@tanstack/react-table";
import {
  UpdateListArraySchema,
  type UpdateList,
} from "../../../models/UpdateList";
import { Status, StatusLabel } from "../../../types";
import {
  changeUpdateListStatus,
  deleteUpdateList,
} from "../../../api/UpdateListAPI";

const UpdateListListView = () => {
  const updatelists = useGet({
    method: "GET",
    endpoint: "updatelists",
    schema: UpdateListArraySchema,
  });
  const [table, setTable] = useState<Table<UpdateList>>();

  const columns: CustomColumnDef<UpdateList>[] = [
    {
      accessorKey: "name",
      header: "Lista di Aggiornamento",
    },
    {
      accessorFn: (row) => `${row.editedProducts} / ${row.totalProducts}`,
      header: "Prodotti Aggiornati",
      cell: ({ row }) => {
        const { editedProducts, totalProducts } = row.original;
        return `${editedProducts} / ${totalProducts}`;
      },
    },
    {
      accessorKey: "status",
      header: "Stato",
      cell: ({ getValue }) => {
        const value = getValue() as Status;
        return (
          <span
            className={`relative py-2 px-4 pl-6 uppercase text-sm border rounded ${
              value == Status.Deleted
                ? "border-red-500 before:bg-red-500"
                : value == Status.Edited
                ? "border-green-500 before:bg-green-500"
                : value == Status.Pending
                ? "border-amber-500 before:bg-amber-500"
                : ""
            } before:block before:w-2 before:h-2 before:rounded-full before:absolute before:left-2 before:top-1/2 before:-translate-y-1/2`}
          >
            {StatusLabel[value]}
          </span>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const { id, status } = row.original;
        let actions: Action[] = [];

        switch (status) {
          case Status.Pending:
            actions.push({
              Icon: FaCheck,
              type: "button",
              color: "green",
              modalConfig: {
                title: "Segnare come completato?",
                description:
                  "Sei sicuro di voler segnare questa lista come completata?",
                confirmColor: "blue",
              },
              handler: async () => {
                var res = await changeUpdateListStatus(id, Status.Edited);

                if (res == true) {
                  updatelists.refetch();
                }
              },
            });
          case Status.Edited:
            actions.push({
              Icon: FaTrash,
              type: "button",
              color: "red",
              modalConfig: {
                title: "Eliminare la lista?",
                description: "Sei sicuro di voler eliminare questa lista?",
              },
              handler: async () => {
                var res = await deleteUpdateList(id);

                if (res == true) {
                  updatelists.refetch();
                }
              },
            });
            break;
        }

        return (
          <div className="flex gap-4">
            <ActionRenderer actions={actions} />
          </div>
        );
      },
    },
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
              type: "link",
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
