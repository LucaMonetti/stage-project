import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="min-w-64 p-8 flex flex-col justify-between border-transparent border-r-gray-700 border-2">
      <ul className="flex flex-col gap-4 flex-1">
        <li>
          <Link to={"adminDashboard"}>Home</Link>
        </li>
        <li>
          <Link to={"products"}>Prodotti</Link>
        </li>
        <li>
          <Link to={"companies"}>Aziende</Link>
        </li>
        <li>
          <Link to={"pricelists"}>Listini</Link>
        </li>
        <li>
          <Link to={"users"}>Utenti</Link>
        </li>
      </ul>

      <Link to={"settings"}>Impostazioni</Link>
    </aside>
  );
};

export default Sidebar;
