import { createBrowserRouter } from "react-router";
import BaseLayout from "../views/BaseLayout";
import HomeView from "../views/Index";
import AdminDashboardLayout from "../views/AdminDashboard/BaseLayout";
import AdminDashboardView from "../views/AdminDashboard/AdminDashboardView";
import CreateProductForm from "../views/AdminDashboard/Create/CreateProduct";
import ProductsListView from "../views/AdminDashboard/Products/ListView";
import SingleProductView from "../views/AdminDashboard/Products/SingleView";
import EditProductForm from "../views/AdminDashboard/Edit/EditProduct";
import PricelistListView from "../views/AdminDashboard/Pricelists/ListView";
import SinglePricelistView from "../views/AdminDashboard/Pricelists/SingleView";
import CompanyListView from "../views/AdminDashboard/Companies/ListView";
import SingleCompanyView from "../views/AdminDashboard/Companies/SingleView";
import CreatePricelistForm from "../views/AdminDashboard/Create/CreatePricelist";
import EditPricelistForm from "../views/AdminDashboard/Edit/EditPricelist";
import CreateCompanyForm from "../views/AdminDashboard/Create/CreateCompany";
import EditCompanyForm from "../views/AdminDashboard/Edit/EditCompany";
import CreateUserForm from "../views/AdminDashboard/Create/CreateUser";
import UsersListView from "../views/AdminDashboard/Users/ListView";
import SingleUserView from "../views/AdminDashboard/Users/SingleView";
import EditUserForm from "../views/AdminDashboard/Edit/EditUser";

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
              {
                path: "pricelists",
                Component: CreatePricelistForm,
              },
              {
                path: "companies",
                Component: CreateCompanyForm,
              },
              {
                path: "users",
                Component: CreateUserForm,
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
              {
                path: "pricelists/:pricelistId",
                Component: EditPricelistForm,
              },
              {
                path: "companies/:companyId",
                Component: EditCompanyForm,
              },
              {
                path: "users/:userId",
                Component: EditUserForm,
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
                index: true,
                Component: PricelistListView,
              },
              {
                path: ":pricelistId",
                Component: SinglePricelistView,
              },
            ],
          },
          {
            path: "companies",
            children: [
              {
                index: true,
                Component: CompanyListView,
              },
              {
                path: ":companyId",
                Component: SingleCompanyView,
              },
            ],
          },
          {
            path: "users",
            children: [
              {
                index: true,
                Component: UsersListView,
              },
              {
                path: ":userId",
                Component: SingleUserView,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
