import { Outlet, useNavigate } from "react-router";
import Sidebar, { type LinkProps } from "../../components/Sidebar/Sidebar";
import { useAuth } from "../../components/Authentication/AuthenticationProvider";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated } = useAuth();

  if (!isAuthenticated) navigate("/auth/login");

  let topLinks: LinkProps[], bottomLinks: LinkProps[];

  if (isAdmin()) {
    topLinks = [
      {
        url: "/dashboard",
        label: "Dashboard",
      },
      {
        url: "companies",
        label: "Aziende",
      },
      {
        url: "pricelists",
        label: "Listini Prezzi",
      },
      {
        url: "products",
        label: "Prodotti",
      },
      {
        url: "users",
        label: "Utenti",
      },
      {
        url: "updatelists",
        label: "Liste di aggiornamento",
      },
    ];

    bottomLinks = [
      {
        url: "settings",
        label: "Impostazioni",
      },
    ];
  } else {
    topLinks = [
      {
        url: "/dashboard",
        label: "Dashboard",
      },
      {
        url: "pricelists",
        label: "Listini Prezzi",
      },
      {
        url: "products",
        label: "Prodotti",
      },
      {
        url: "update-lists",
        label: "Liste di aggiornamento",
      },
    ];

    bottomLinks = [
      {
        url: "settings",
        label: "Impostazioni",
      },
    ];
  }

  return (
    <div className="flex">
      <Sidebar topLinks={topLinks} bottomLinks={bottomLinks} />
      <main className="flex-1 max-w-[calc(100vw-256px)] ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
