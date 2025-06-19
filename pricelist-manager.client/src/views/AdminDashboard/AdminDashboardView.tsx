import ItenCounterGroup from "../../components/Dashboard/ItemCounter/ItenCounterGroup";
import ItemListGroup from "../../components/Dashboard/ItemList/ItemListGroup";

function AdminDashboardView() {
  return (
    <>
      <h1 className="text-3xl text-blue-600 font-medium">Dashboard</h1>
      <p>Gestisci Prodotti, Aziende, Utenti e Listini in modo centralizzato.</p>

      <ItenCounterGroup />
      <ItemListGroup />
    </>
  );
}

export default AdminDashboardView;
