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
