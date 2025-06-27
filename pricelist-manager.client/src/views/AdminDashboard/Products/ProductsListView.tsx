import GenericTableView from "../../../components/Dashboard/Tables/GenericTableView";
import { useFetch } from "../../../hooks/useFetch";
import { ProductArraySchema, type Product } from "../../../models/Product";

const ProductsListView = () => {
  const products = useFetch("products", ProductArraySchema);

  const columns = [
    {
      key: "companyId" as keyof Product,
      header: "Azienda",
      mobileLabel: "Azienda",
      className: "text-gray-500",
    },
    {
      key: "pricelist.name" as keyof Product,
      header: "Listino",
      mobileLabel: "Pricelist",
      className: "text-gray-500",
    },
    {
      key: "id" as keyof Product,
      header: "Codice Prodotto",
      mobileLabel: "Code",
    },
    {
      key: "currentInstance.name" as keyof Product,
      header: "Nome",
    },
    {
      key: "currentInstance.description" as keyof Product,
      header: "Descrizione",
      className: "max-w-xs truncate",
      render: (value: string) => (
        <span className="block truncate" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: "currentInstance.price" as keyof Product,
      header: "Prezzo",
      className: "font-medium text-green-600",
      render: (value: number) => `${value.toFixed(2)} €`,
    },
    {
      key: "currentInstance.cost" as keyof Product,
      header: "Costo",
      className: "font-medium text-red-600",
      render: (value: number) => `${value.toFixed(2)} €`,
    },
  ];

  return (
    <div className="px-8 py-4">
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
