import { FaPlus } from "react-icons/fa6";
import ActionRenderer from "../../../components/Buttons/ActionRenderer";
import GenericTableView, {
  type CustomColumnDef,
} from "../../../components/Dashboard/Tables/GenericTableView";
import { type User, type UserFilter } from "../../../models/User";
import { useEffect, useState } from "react";
import type { Table } from "@tanstack/react-table";
import type { Config } from "../../../components/Forms/GenericForm";
import { useAllUsersPaginated } from "../../../hooks/users/useQueryUsers";
import { useAuth } from "../../../components/Authentication/AuthenticationProvider";
import { useNavigate } from "react-router";
import { useDebounce } from "../../../hooks/useDebounce";
import { useAllCompanies } from "../../../hooks/companies/useQueryCompanies";

const UsersListView = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin()) navigate("/auth/login");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<UserFilter>({});
  const [usernameInput, setUsernameInput] = useState("");

  const debouncedUsername = useDebounce(usernameInput, 800);

  // Add this useEffect to update filters when debouncedUsername changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      username: debouncedUsername || undefined,
    }));
    setCurrentPage(1);
  }, [debouncedUsername]);

  const { data, isPending, isError, error } = useAllUsersPaginated(
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

  const handleFilterChange = (newFilters: Partial<UserFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const companies = useAllCompanies();
  const [, setTable] = useState<Table<User>>();

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
              setUsernameInput(e.target.value);
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
              route: `/dashboard/create/users`,
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
          baseUrl: "/dashboard/users/:uid",
          enableLink: true,
          columnId: { ":uid": "id" },
        }}
        keyField="id"
        pagination={data?.pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default UsersListView;
