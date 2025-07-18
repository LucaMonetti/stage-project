import { FaCheck, FaPlus, FaTrash } from "react-icons/fa6";
import ActionRenderer, {
  type Action,
} from "../../../components/Buttons/ActionRenderer";
import GenericTableView, {
  type CustomColumnDef,
} from "../../../components/Dashboard/Tables/GenericTableView";
import { useEffect, useState, type ChangeEvent } from "react";
import type { Table } from "@tanstack/react-table";
import {
  type UpdateList,
  type UpdateListFilter,
} from "../../../models/UpdateList";
import { Status, StatusLabel } from "../../../types";
import {
  useAllUpdateListsByCompany,
  useAllUpdateListsPaged,
} from "../../../hooks/updatelists/useQueryUpdatelists";
import {
  useDeleteUpdateList,
  useEditUpdateListStatus,
} from "../../../hooks/updatelists/useMutationUpdateList";
import type { UseQueryResult } from "@tanstack/react-query";
import { useAuth } from "../../../components/Authentication/AuthenticationProvider";
import { useDebounce } from "../../../hooks/useDebounce";
import type { PaginatedResponse } from "../../../models/Pagination";
import { useAllCompanies } from "../../../hooks/companies/useQueryCompanies";
import type { Config } from "../../../components/Forms/GenericForm";

const UpdateListListView = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<UpdateListFilter>({});
  const [listNameInput, setListNameInput] = useState("");

  const debouncedListName = useDebounce(listNameInput, 800);

  // Add this useEffect to update filters when debouncedListName changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      name: debouncedListName || undefined,
    }));
    setCurrentPage(1);
  }, [debouncedListName]);

  const { isAdmin, user } = useAuth();

  let updatelists: UseQueryResult<PaginatedResponse<UpdateList>>;

  if (isAdmin()) {
    updatelists = useAllUpdateListsPaged(
      {
        CurrentPage: currentPage,
        PageSize: pageSize,
      },
      filters
    );
  } else {
    // If not admin, fetch only the update lists for the user's company
    updatelists = useAllUpdateListsByCompany(
      user?.company.id ?? "",
      {
        CurrentPage: currentPage,
        PageSize: pageSize,
      },
      filters
    );
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Partial<UpdateListFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const { data, isPending, isError, error } = updatelists;
  const companies = useAllCompanies();

  const [_, setTable] = useState<Table<UpdateList>>();

  const deleteMutation = useDeleteUpdateList();
  const editStateMutation = useEditUpdateListStatus();

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
            className={`relative py-2 px-4 pl-6 uppercase whitespace-nowrap text-sm border rounded ${
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

        // Define actions outside the switch
        const completeAction: Action = {
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
            editStateMutation.mutate({ id: id, status: Status.Edited });
          },
        };

        const deleteAction: Action = {
          Icon: FaTrash,
          type: "button",
          color: "red",
          modalConfig: {
            title: "Eliminare la lista?",
            description: "Sei sicuro di voler eliminare questa lista?",
          },
          handler: async () => {
            deleteMutation.mutate(id);
          },
        };

        let actions: Action[] = [];

        switch (status) {
          case Status.Pending:
            actions = [completeAction, deleteAction];
            break;
          case Status.Edited:
            actions = [deleteAction];
            break;
        }

        return (
          <div className="flex gap-4">
            <ActionRenderer actions={actions} />
          </div>
        );
      },
    },
  ];

  let filterConfig = {
    fieldset: [
      {
        title: "Filtri",
        inputs: [
          {
            id: "name",
            label: "Nome Lista",
            type: "text",
            placeholder: "Inserire il nome della lista",
            autocomplete: false,
            outerClass: "flex-1",
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
              setListNameInput(e.target.value);
            },
          },
          {
            id: "companyId",
            label: "Codice Azienda",
            type: "searchable",
            placeholder: "Selezionare codice azienda...",
            fetchData: companies,
            schema: "company",
            onChange: (value: any) => {
              handleFilterChange({ companyId: value || undefined });
            },
          },
        ],
      },
    ],
    endpoint: "products",
  } satisfies Config<UpdateListFilter>;

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
              route: `/dashboard/create/updatelists`,
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
        filterConfig={filterConfig}
        onTableReady={setTable}
        config={{
          baseUrl: "/dashboard/updatelists/:pid",
          enableLink: true,
          columnId: { ":pid": "id" },
        }}
        keyField="id"
        pagination={data?.pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default UpdateListListView;
