import { useFetch } from "../../../hooks/useFetch";
import { CompanyArraySchema } from "../../../models/Company";
import { PricelistArraySchema } from "../../../models/Pricelist";
import { ProductArraySchema } from "../../../models/Product";
import { UserArrraySchema } from "../../../models/User";
import ItemList from "./ItemList";

const ItemListGroup = () => {
  const products = useFetch("products", ProductArraySchema);
  const pricelists = useFetch("pricelists", PricelistArraySchema);
  const companies = useFetch("companies", CompanyArraySchema);
  const users = useFetch("accounts", UserArrraySchema);

  return (
    <div className="flex flex-col flex-wrap gap-8 mt-8">
      <ItemList
        title="Aziende"
        fetch={companies}
        getline={(item) => item.name}
        getCallout={(item) => item.id}
        getUniqueId={(item) => item.id}
        getRoute={(item) => `/admin-dashboard/companies/${item.id}`}
      />
      <ItemList
        title="Listini"
        fetch={pricelists}
        getline={(item) => item.name}
        getCallout={(item) =>
          item.products ? item.products.length.toString() : "0"
        }
        getUniqueId={(item) => item.id}
        getRoute={(item) => `/admin-dashboard/pricelists/${item.id}`}
      />
      <ItemList
        title="Prodotti"
        fetch={products}
        getline={(item) => item.currentInstance.name}
        getCallout={(item) => item.productCode}
        getUniqueId={(item) => item.id}
        getRoute={(item) => `/admin-dashboard/products/${item.id}`}
      />
      <ItemList
        title="Utenti"
        fetch={users}
        getline={(item) => item.username}
        getUniqueId={(item) => item.id}
        getRoute={(item) => `/admin-dashboard/users/${item.id}`}
      />
    </div>
  );
};

export default ItemListGroup;
