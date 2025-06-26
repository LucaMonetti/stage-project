import GenericTableView from "../../../components/Dashboard/Tables/GenericTableView";
import { useFetch } from "../../../hooks/useFetch";
import { ProductArraySchema, type Product } from "../../../models/Product";

const ProductsListView = () => {
  const products = useFetch("products", ProductArraySchema);

  const columns = [
    {
      key: "productCode" as keyof Product,
      header: "Product Code",
      mobileLabel: "Code",
    },
    {
      key: "currentInstance.name" as keyof Product,
      header: "Name",
    },
    {
      key: "pricelist.name" as keyof Product,
      header: "Pricelist",
      mobileLabel: "Pricelist",
      className: "text-gray-500",
    },
    {
      key: "currentInstance.description" as keyof Product,
      header: "Description",
      className: "max-w-xs truncate",
      render: (value: string) => (
        <span className="block truncate" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: "currentInstance.price" as keyof Product,
      header: "Price",
      className: "font-medium text-green-600",
      render: (value: number) => `${value.toFixed(2)} €`,
    },
    {
      key: "companyId" as keyof Product,
      header: "Company ID",
      mobileLabel: "Company",
      className: "text-gray-500",
    },
  ];

  return (
    <div className="px-8 py-4">
      <GenericTableView
        data={products}
        columns={columns}
        config={{
          baseUrl: "/admin-dashboard/pricelists/:pid/products/:pcode",
          enableLink: true,
          columnId: { ":pid": "pricelistId", ":pcode": "productCode" },
        }}
        keyField="productCode"
      />
    </div>
  );
};

export default ProductsListView;
