import { createBrowserRouter } from "react-router";
import BaseLayout from "../views/BaseLayout";
import HomeView from "../views/Index";
import AdminDashboardLayout from "../views/AdminDashboard/BaseLayout";
import AdminDashboardView from "../views/AdminDashboard/AdminDashboardView";

const router = createBrowserRouter([
    {
        path: "/",
        Component: BaseLayout,
        children: [
            {
                index: true,
                Component: HomeView,
            },
            {
                path: "admin-dashboard",
                Component: AdminDashboardLayout,
                children: [
                    {
                        index: true,
                        Component: AdminDashboardView
                    }
                ]
            },
        ],
    },
]);

export default router;