import { useAuth } from "../../components/Authentication/AuthenticationProvider";
import BasicLoader from "../../components/Loader/BasicLoader";
import AdminDashboardView from "../AdminDashboard/AdminDashboardView";
import CompanyDashboard from "../CompanyDashboard/CompanyDashboard";

const DashboardView = () => {
  const { isAdmin, user, isAuthenticated } = useAuth();

  // Wait for authentication and user data to be loaded
  if (isAuthenticated !== true || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <BasicLoader />
      </div>
    );
  }

  if (isAdmin()) {
    return <AdminDashboardView />;
  } else {
    return <CompanyDashboard />;
  }
};

export default DashboardView;
