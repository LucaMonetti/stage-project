import { useFetch } from "../../../hooks/useFetch";
import { CompanyArraySchema } from "../../../models/Company";
import { PricelistArraySchema } from "../../../models/Pricelist";
import { ProductArraySchema } from "../../../models/Product";
import ItemList from "./ItemList";

const ItemListGroup = () => {
  const products = useFetch("products", ProductArraySchema);
  const pricelists = useFetch("pricelists", PricelistArraySchema);
  const companies = useFetch("companies", CompanyArraySchema);

  return (
    <div className="flex flex-col flex-wrap gap-8 mt-8">
      <ItemList
        title="Aziende"
        fetch={companies}
        getline={(item) => item.name}
        getCallout={(item) => item.id}
      />
      <ItemList
        title="Listini"
        fetch={pricelists}
        getline={(item) => item.name}
        getCallout={(item) =>
          item.products ? item.products.length.toString() : "0"
        }
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
