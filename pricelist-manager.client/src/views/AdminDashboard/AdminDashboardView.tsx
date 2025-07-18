import ItenCounterGroupAdmin from "../../components/Dashboard/ItemCounter/ItenCounterGroupAdmin";
import ItemListGroupAdmin from "../../components/Dashboard/ItemList/ItemListGroupAdmin";

function AdminDashboardView() {
  return (
    <div className="py-4 px-8">
      <h1 className="text-3xl text-blue-600 font-medium">Dashboard</h1>
      <p>Gestisci Prodotti, Aziende, Utenti e Listini in modo centralizzato.</p>

      <ItenCounterGroupAdmin />
      <ItemListGroupAdmin />
    </div>
  );
}

export default AdminDashboardView;
