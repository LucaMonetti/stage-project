import ItenCounterGroup from "../../components/Dashboard/ItemCounter/ItenCounterGroup";
import ItemListGroup from "../../components/Dashboard/ItemList/ItemListGroup";

function AdminDashboardView() {
  return (
    <div className="py-4 px-8">
      <h1 className="text-3xl text-blue-600 font-medium">Dashboard</h1>
      <p>Gestisci Prodotti, Aziende, Utenti e Listini in modo centralizzato.</p>

      <ItenCounterGroup />
      <ItemListGroup />
    </div>
  );
}

export default AdminDashboardView;
