import GenericTableView from "../../../components/Dashboard/Tables/GenericTableView";
import TableView from "../../../components/Dashboard/Tables/TableView";
import { useFetch } from "../../../hooks/useFetch";
import { ProductArraySchema, type Product } from "../../../models/Product";

const ProductsListView = () => {
  const products = useFetch(
    "/api/pricelists/3fa85f64-5717-4562-b3fc-2c963f66afa6/products",
    ProductArraySchema
  );

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
      key: "pricelistId" as keyof Product,
      header: "Pricelist ID",
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
        keyField="productCode"
      />
    </div>
  );
};

export default ProductsListView;
