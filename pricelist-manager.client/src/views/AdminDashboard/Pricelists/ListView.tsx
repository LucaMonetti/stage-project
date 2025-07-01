import { FaPlus } from "react-icons/fa6";
import ActionRenderer from "../../../components/Buttons/ActionRenderer";
import GenericTableView from "../../../components/Dashboard/Tables/GenericTableView";
import { useFetch } from "../../../hooks/useFetch";
import {
  PricelistArraySchema,
  type Pricelist,
} from "../../../models/Pricelist";

const PricelistListView = () => {
  const pricelists = useFetch("pricelists", PricelistArraySchema);

  const columns = [
    {
      key: "company.id" as keyof Pricelist,
      header: "Azienda",
      mobileLabel: "Azienda",
      className: "text-gray-500",
    },
    {
      key: "id" as keyof Pricelist,
      header: "Listino",
      mobileLabel: "Pricelist",
      className: "text-gray-500",
    },
    {
      key: "name" as keyof Pricelist,
      header: "Nome Listino",
      mobileLabel: "Code",
    },
    {
      key: "description" as keyof Pricelist,
      header: "Descrizione",
      className: "max-w-xs truncate",
      render: (value: string) => (
        <span className="block truncate" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: "products" as keyof Pricelist,
      header: "Totale Prodotti",
      render: (value: any[]) => (
        <span className="text-blue-400">
          {value.length} {value.length === 1 ? "prodotto" : "prodotti"}
        </span>
      ),
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
