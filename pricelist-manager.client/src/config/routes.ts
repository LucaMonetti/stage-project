import { createBrowserRouter } from "react-router";
import BaseLayout from "../views/BaseLayout";
import HomeView from "../views/Index";
import AdminDashboardLayout from "../views/AdminDashboard/BaseLayout";
import AdminDashboardView from "../views/AdminDashboard/AdminDashboardView";
import CreateProductForm from "../views/AdminDashboard/CreateProduct/CreateProduct";
import ProductsListView from "../views/AdminDashboard/Products/ProductsListView";
import SingleProductView from "../views/AdminDashboard/Products/Single/SingleView";

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
            children: [
              {
                index: true,
                Component: ProductsListView,
              },
            ],
          },
          {
            path: "pricelists",
            children: [
              {
                path: ":pricelistId",
                children: [
                  {
                    path: "products/:productCode",
                    Component: SingleProductView,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
