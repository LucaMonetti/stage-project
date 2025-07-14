import { useAuth } from "../../components/Authentication/AuthenticationProvider";
import ItenCounterGroupCompany from "../../components/Dashboard/ItemCounter/ItenCounterGroupCompany";
import ItemListGroupCompany from "../../components/Dashboard/ItemList/ItemListGroupCompany";

function CompanyDashboard() {
  const { user } = useAuth();

  return (
    <div className="py-4 px-8">
      <h1 className="text-3xl text-blue-600 font-medium">
        {user?.company.name} Dashboard
      </h1>
      <p>Gestisci Prodotti, e Listini</p>

      <ItenCounterGroupCompany />
      <ItemListGroupCompany companyId={user?.company.id ?? ""} />
    </div>
  );
}

export default CompanyDashboard;
