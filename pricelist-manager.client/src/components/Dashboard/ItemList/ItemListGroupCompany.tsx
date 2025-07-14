import { useAllCompanies } from "../../../hooks/companies/useQueryCompanies";
import {
  useAllPricelists,
  useAllPricelistsByCompany,
} from "../../../hooks/pricelists/useQueryPricelists";
import {
  useAllProducts,
  useAllProductsByCompany,
} from "../../../hooks/products/useQueryProducts";
import {
  useAllUpdateLists,
  useUpdateList,
} from "../../../hooks/updatelists/useQueryUpdatelists";
import { useFetch } from "../../../hooks/useFetch";
import { useAllUsers } from "../../../hooks/users/useQueryUsers";
import { CompanyArraySchema } from "../../../models/Company";
import { PricelistArraySchema } from "../../../models/Pricelist";
import { ProductArraySchema } from "../../../models/Product";
import { UserArraySchema } from "../../../models/User";
import ItemList from "./ItemList";

const ItemListGroupCompany = ({ companyId }: { companyId: string }) => {
  const {
    data: products,
    isPending: isProductsPending,
    isError: isProductError,
    error: productErrot,
  } = useAllProductsByCompany(companyId);

  const {
    data: pricelists,
    isPending: isPricelistsPending,
    isError: isPricelistsError,
    error: pricelistsError,
  } = useAllPricelistsByCompany(companyId);

  const {
    data: updatelists,
    isPending: isUpdateListsPending,
    isError: isUpdatelistsError,
    error: updatelistsError,
  } = useAllUpdateLists();

  return (
    <div className="flex flex-col flex-wrap gap-8 mt-8">
      <ItemList
        title="Listini"
        data={pricelists ?? []}
        isPending={isPricelistsPending}
        isError={isPricelistsError}
        error={pricelistsError}
        getline={(item) => item.name}
        getCallout={(item) =>
          item.products ? item.products.length.toString() : "0"
        }
        getUniqueId={(item) => item.id}
        getRoute={(item) => `/dashboard/pricelists/${item.id}`}
      />
      <ItemList
        title="Prodotti"
        data={products ?? []}
        isPending={isProductsPending}
        isError={isProductError}
        error={productErrot}
        getline={(item) => item.currentInstance.name}
        getCallout={(item) => item.id}
        getUniqueId={(item) => item.id}
        getRoute={(item) => `/dashboard/products/${item.id}`}
      />
      <ItemList
        title="Liste di aggiornamento"
        data={updatelists ?? []}
        isPending={isUpdateListsPending}
        isError={isUpdatelistsError}
        error={updatelistsError}
        getline={(item) => item.name}
        getUniqueId={(item) => `#${item.id.toString()}`}
        getRoute={(item) => `/dashboard/updatelists/${item.id}`}
      />
    </div>
  );
};

export default ItemListGroupCompany;
