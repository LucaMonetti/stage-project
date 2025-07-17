import { useAllPricelistsByCompany } from "../../../hooks/pricelists/useQueryPricelists";
import { useAllProductsByCompany } from "../../../hooks/products/useQueryProducts";
import { useAllUpdateListsByCompany } from "../../../hooks/updatelists/useQueryUpdatelists";
import ItemList from "./ItemList";

const ItemListGroupCompany = ({ companyId }: { companyId: string }) => {
  const {
    data: products,
    isPending: isProductsPending,
    isError: isProductError,
    error: productErrot,
  } = useAllProductsByCompany(companyId, { CurrentPage: 1, PageSize: 5 });

  const {
    data: pricelists,
    isPending: isPricelistsPending,
    isError: isPricelistsError,
    error: pricelistsError,
  } = useAllPricelistsByCompany(companyId, { CurrentPage: 1, PageSize: 5 });

  const {
    data: updatelists,
    isPending: isUpdateListsPending,
    isError: isUpdatelistsError,
    error: updatelistsError,
  } = useAllUpdateListsByCompany(companyId, { CurrentPage: 1, PageSize: 5 });

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
        showAllLink="/dashboard/pricelists"
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
        showAllLink="/dashboard/products"
      />
      <ItemList
        title="Liste di aggiornamento"
        data={updatelists?.items ?? []}
        isPending={isUpdateListsPending}
        isError={isUpdatelistsError}
        error={updatelistsError}
        getline={(item) => item.name}
        getUniqueId={(item) => `#${item.id.toString()}`}
        getRoute={(item) => `/dashboard/updatelists/${item.id}`}
        showAllLink="/dashboard/updatelists"
      />
    </div>
  );
};

export default ItemListGroupCompany;
