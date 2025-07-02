import { FaPlus } from "react-icons/fa6";
import ActionRenderer from "../../../components/Buttons/ActionRenderer";
import GenericTableView, {
  type Column,
  type CustomColumnDef,
} from "../../../components/Dashboard/Tables/GenericTableView";
import { useFetch } from "../../../hooks/useFetch";
import {
  UserArrraySchema,
  type User,
  type UserFilter,
} from "../../../models/User";
import { useGet } from "../../../hooks/useGenericFetch";
import { useState } from "react";
import type { ColumnDef, Table } from "@tanstack/react-table";
import type { Config } from "../../../components/Forms/GenericForm";
import { CompanyArraySchema } from "../../../models/Company";

const UsersListView = () => {
  const users = useGet({
    method: "GET",
    endpoint: "accounts",
    schema: UserArrraySchema,
  });
  const [table, setTable] = useState<Table<User>>();

  const columns: CustomColumnDef<User>[] = [
    {
      accessorKey: "company.id",
      header: "Azienda",
      meta: {
        className: "text-gray-500",
      },
    },
    {
      accessorKey: "username",
      header: "Nome Utente",
    },
    {
      accessorKey: "roles",
      header: "Ruolo",
      cell: ({ getValue }) => {
        const value = getValue() as string[];
        return value.join(", ");
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      linkUrl: (item) => `mailto:${item.email}`,
    },
    {
      accessorKey: "phone",
      header: "Numero di telefono",
      linkUrl: (item) => `tel:${item.phone}`,
    },
  ];

  const filterConfig = {
    fieldset: [
      {
        title: "Filtri",
        inputs: [
          {
            id: "username",
            label: "Username",
            type: "text",
            placeholder: "Cerca per username...",
            autocomplete: false,
            outerClass: "flex-1",
            onChange: (e) => {
              table?.getColumn("username")?.setFilterValue(e.target.value);
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
  } satisfies Config<UserFilter>;

  return (
    <div className="px-8 py-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl text-medium">Utenti</h1>
          <p className="text-gray-400">
            Visualizza tutti gli Account registrati all'interno della
            piattaforma.
          </p>
        </div>
        <ActionRenderer
          actions={[
            {
              color: "blue",
              Icon: FaPlus,
              route: `/admin-dashboard/create/users`,
            },
          ]}
        />
      </div>

      <GenericTableView
        data={users}
        columns={columns}
        filterConfig={filterConfig}
        onTableReady={setTable}
        config={{
          baseUrl: "/admin-dashboard/users/:uid",
          enableLink: true,
          columnId: { ":uid": "id" },
        }}
        keyField="id"
      />
    </div>
  );
};

export default UsersListView;
