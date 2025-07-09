import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="min-w-64 p-8 h-[calc(100vh-64px)] flex flex-col justify-between border-transparent border-r-gray-700 border-2 fixed top-16">
      <ul className="flex flex-col gap-4">
        <li>
          <Link to={"/admin-dashboard"}>Home</Link>
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
        <li>
          <Link to={"updatelists"}>Liste di Aggiornamento</Link>
        </li>
      </ul>

      <Link to={"/settings"}>Impostazioni</Link>
    </aside>
  );
};

export default Sidebar;
