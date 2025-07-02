import { FaPlus } from "react-icons/fa6";
import ActionRenderer from "../../../components/Buttons/ActionRenderer";
import GenericTableView, {
  type CustomColumnDef,
} from "../../../components/Dashboard/Tables/GenericTableView";
import { useFetch } from "../../../hooks/useFetch";
import { ProductArraySchema, type Product } from "../../../models/Product";
import { type ColumnDef } from "@tanstack/react-table";

const ProductsListView = () => {
  const products = useFetch("products", ProductArraySchema);

  const columns: CustomColumnDef<Product>[] = [
    {
      accessorKey: "companyId",
      header: "Azienda",
      meta: {
        mobileLabel: "Azienda",
        className: "text-gray-500",
      },
    },
    {
      accessorKey: "pricelist.name",
      header: "Listino",
      meta: {
        mobileLabel: "Pricelist",
        className: "text-gray-500",
      },
    },
    {
      accessorKey: "productCode",
      header: "Codice Prodotto",
      meta: {
        mobileLabel: "Code",
      },
    },
    {
      accessorKey: "currentInstance.name",
      header: "Nome",
    },
    {
      accessorKey: "currentInstance.description",
      header: "Descrizione",
      meta: {
        className: "max-w-xs truncate",
      },
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return (
          <span className="block truncate" title={value}>
            {value}
          </span>
        );
      },
    },
    {
      accessorKey: "currentInstance.price",
      header: "Prezzo",
      meta: {
        className: "font-medium text-green-600 whitespace-nowrap",
      },
      accessorFn: (row: Product) => `${row.currentInstance.price.toFixed(2)} €`,
    },
    {
      accessorKey: "currentInstance.cost",
      header: "Costo",
      meta: {
        className: "font-medium text-red-600 whitespace-nowrap",
      },
      accessorFn: (row: Product) => `${row.currentInstance.cost.toFixed(2)} €`,
    },
  ];

  return (
    <div className="px-8 py-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl text-medium">Prodotti</h1>
          <p className="text-gray-400">
            Visualizza tutti i prodotti registrati all'interno della
            piattaforma.
          </p>
        </div>
        <ActionRenderer
          actions={[
            {
              color: "blue",
              Icon: FaPlus,
              route: `/admin-dashboard/create/products`,
            },
          ]}
        />
      </div>

      <GenericTableView
        data={products}
        columns={columns}
        config={{
          baseUrl: "/admin-dashboard/products/:pid",
          enableLink: true,
          columnId: { ":pid": "id" },
        }}
        keyField="productCode"
      />
    </div>
  );
};

export default ProductsListView;
