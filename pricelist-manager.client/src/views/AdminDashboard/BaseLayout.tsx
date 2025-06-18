import { Outlet } from "react-router";

const AdminDashboardLayout = () => {
    return (
        <div className="flex gap-8">
            <aside>
                <p>Sidebar</p>
            </aside>
            <main>
                <Outlet />
            </main>
		</div>
    );
};

export default AdminDashboardLayout;