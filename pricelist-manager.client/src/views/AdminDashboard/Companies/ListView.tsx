import { FaPlus } from "react-icons/fa6";
import ActionRenderer from "../../../components/Buttons/ActionRenderer";
import GenericTableView from "../../../components/Dashboard/Tables/GenericTableView";
import { useFetch } from "../../../hooks/useFetch";
import { useGet } from "../../../hooks/useGenericFetch";
import { CompanyArraySchema, type Company } from "../../../models/Company";

const CompanyListView = () => {
  const companies = useGet({
    method: "GET",
    endpoint: "companies",
    schema: CompanyArraySchema,
  });

  const columns = [
    {
      key: "id" as keyof Company,
      header: "Codice Azienda",
      className: "text-gray-500",
    },
    {
      key: "name" as keyof Company,
      header: "Ragione Sociale",
    },
    {
      key: "phone" as keyof Company,
      header: "Descrizione",
    },
    {
      key: "pricelists" as keyof Company,
      header: "Totale Listini",
      render: (value: any[]) => (
        <span className="uppercase">
          {value.length ?? 0} {value.length === 1 ? "listino" : "listini"}
        </span>
      ),
    },
    {
      key: "products" as keyof Company,
      header: "Totale Prodotti",
      render: (value: any[]) => (
        <span className="uppercase">
          {value.length ?? 0} {value.length === 1 ? "prodotto" : "prodotti"}
        </span>
      ),
    },
  ];

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
