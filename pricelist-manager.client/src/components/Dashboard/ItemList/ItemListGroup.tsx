import { useFetch } from "../../../hooks/useFetch";
import { CompanyArraySchema } from "../../../models/Company";
import { PricelistArraySchema } from "../../../models/Pricelist";
import { ProductArraySchema, type Product } from "../../../models/Product";
import ItemList from "./ItemList";

const ItemListGroup = () => {
  const products = useFetch("api/products", ProductArraySchema);
  const pricelists = useFetch("api/pricelists", PricelistArraySchema);

  const companies = useFetch("api/companies", CompanyArraySchema);

  return (
    <div className="flex flex-col flex-wrap gap-8 mt-8">
      <ItemList
        title="Aziende"
        fetch={companies}
        getline={(item) => item.name}
        getCallout={(item) => item.id}
      />
      <ItemList
        title="Pricelist"
        fetch={pricelists}
        getline={(item) => item.name}
        getCallout={(item) => item.products.length.toString()}
      />
      <ItemList
        title="Prodotti"
        fetch={products}
        getline={(item) => item.currentInstance.name}
        getCallout={(item) => item.productCode}
      />
    </div>
  );
};

export default ItemListGroup;
