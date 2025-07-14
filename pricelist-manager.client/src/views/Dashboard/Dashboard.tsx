import { useAuth } from "../../components/Authentication/AuthenticationProvider";
import AdminDashboardView from "../AdminDashboard/AdminDashboardView";
import CompanyDashboard from "../CompanyDashboard/CompanyDashboard";

const DashboardView = () => {
  const { isAdmin } = useAuth();

  if (isAdmin()) {
    return <AdminDashboardView />;
  }

  return <CompanyDashboard />;
};

export default DashboardView;
