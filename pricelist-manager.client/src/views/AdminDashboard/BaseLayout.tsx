import { Outlet } from "react-router";
import Sidebar from "../../components/Sidebar/Sidebar";

const AdminDashboardLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 max-w-[calc(100vw-256px)] ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
