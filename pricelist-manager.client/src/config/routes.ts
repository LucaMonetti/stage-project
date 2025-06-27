import { createBrowserRouter } from "react-router";
import BaseLayout from "../views/BaseLayout";
import HomeView from "../views/Index";
import AdminDashboardLayout from "../views/AdminDashboard/BaseLayout";
import AdminDashboardView from "../views/AdminDashboard/AdminDashboardView";
import CreateProductForm from "../views/AdminDashboard/CreateProduct/CreateProduct";
import ProductsListView from "../views/AdminDashboard/Products/ProductsListView";
import SingleProductView from "../views/AdminDashboard/Products/Single/SingleView";
import EditProductForm from "../views/AdminDashboard/Edit/EditProduct";

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
            path: "create",
            children: [
              {
                path: "products",
                Component: CreateProductForm,
              },
            ],
          },
          {
            path: "products",
            children: [
              {
                index: true,
                Component: ProductsListView,
              },
              {
                path: ":productId",
                Component: SingleProductView,
              },
            ],
          },
          {
            path: "pricelists",
            children: [
              {
                path: ":pricelistId",
                children: [],
              },
            ],
          },
          {
            path: "edit",
            children: [
              {
                path: "products/:productId",
                Component: EditProductForm,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
