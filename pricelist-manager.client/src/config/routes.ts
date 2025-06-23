import { createBrowserRouter } from "react-router";
import BaseLayout from "../views/BaseLayout";
import HomeView from "../views/Index";
import AdminDashboardLayout from "../views/AdminDashboard/BaseLayout";
import AdminDashboardView from "../views/AdminDashboard/AdminDashboardView";
import CreateProductForm from "../views/AdminDashboard/CreateProduct/CreateProduct";
import ProductsListView from "../views/AdminDashboard/Products/ProductsListView";

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
            Component: AdminDashboardView,
          },
          {
            path: "create-product",
            Component: CreateProductForm,
          },
          {
            path: "products",
            Component: ProductsListView,
          },
        ],
      },
    ],
  },
]);

export default router;
