import { FaPlus } from "react-icons/fa6";
import ActionRenderer from "../../../components/Buttons/ActionRenderer";
import GenericTableView, {
  type Column,
} from "../../../components/Dashboard/Tables/GenericTableView";
import { useFetch } from "../../../hooks/useFetch";
import { UserArrraySchema, type User } from "../../../models/User";

const UsersListView = () => {
  const Users = useFetch("accounts", UserArrraySchema);

  const columns = [
    {
      key: "company.id",
      header: "Azienda",
      className: "text-gray-500",
    },
    {
      key: "username",
      header: "Nome Utente",
    },
    {
      key: "roles",
      header: "Ruolo",
      render: (value: string[]) => value.join(", "),
    },
    {
      key: "email",
      header: "Email",
      linkUrl: (item) => `mailto:${item.email}`,
    },
    {
      key: "phone",
      header: "Numero di telefono",
      linkUrl: (item) => `tel:${item.phone}`,
    },
  ] satisfies Column<User>[];

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
        data={Users}
        columns={columns}
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
