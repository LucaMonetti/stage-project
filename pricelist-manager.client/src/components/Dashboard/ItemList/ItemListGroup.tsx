import { useFetch } from "../../../hooks/useFetch";
import { ProductArraySchema, type Product } from "../../../models/Product";
import ItemList from "./ItemList";

const ItemListGroup = () => {
  const prod = useFetch(
    "api/pricelists/3fa85f64-5717-4562-b3fc-2c963f66afa7/products",
    ProductArraySchema
  );

  return (
    <div className="flex flex-wrap gap-8 mt-8">
      <ItemList<Product[]>
        title="Prodotti"
        fetch={prod}
        getline={(item) => item.versions[0].name}
      />
    </div>
  );
};

export default ItemListGroup;
