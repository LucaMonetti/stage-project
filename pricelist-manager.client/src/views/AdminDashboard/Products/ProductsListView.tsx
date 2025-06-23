import TableView from "../../../components/Dashboard/Tables/TableView";
import { useFetch } from "../../../hooks/useFetch";
import { ProductArraySchema } from "../../../models/Product";

const ProductsListView = () => {
  const products = useFetch(
    "/api/pricelists/3fa85f64-5717-4562-b3fc-2c963f66afa6/products",
    ProductArraySchema
  );

  return (
    <div className="px-8 py-4">
      <TableView products={products} />
    </div>
  );
};

export default ProductsListView;
