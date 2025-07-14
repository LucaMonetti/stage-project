import { Outlet, useNavigate } from "react-router";
import Sidebar, { type LinkProps } from "../../components/Sidebar/Sidebar";
import { useAuth } from "../../components/Authentication/AuthenticationProvider";
import { useEffect } from "react";
import BasicLoader from "../../components/Loader/BasicLoader";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/auth/login");
    }
  }, [isAuthenticated, navigate]);

  // Show loading state while authentication status is being determined
  if (isAuthenticated !== true) {
    return (
      <div className="flex items-center justify-center h-screen">
        <BasicLoader />
      </div>
    );
  }

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
