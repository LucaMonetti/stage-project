import {
  useAllCompanies,
  useAllCompaniesPaginated,
} from "../../../hooks/companies/useQueryCompanies";
import {
  useAllPricelists,
  useAllPricelistsPaginated,
} from "../../../hooks/pricelists/useQueryPricelists";
import { useAllProductsPaginated } from "../../../hooks/products/useQueryProducts";
import {
  useAllUsers,
  useAllUsersPaginated,
} from "../../../hooks/users/useQueryUsers";
import ItemList from "./ItemList";

const ItemListGroupAdmin = () => {
  const {
    data: products,
    isPending: isProductsPending,
    isError: isProductError,
    error: productErrot,
  } = useAllProductsPaginated({ CurrentPage: 1, PageSize: 5 });

  const {
    data: pricelists,
    isPending: isPricelistsPending,
    isError: isPricelistsError,
    error: pricelistsError,
  } = useAllPricelistsPaginated({ CurrentPage: 1, PageSize: 5 });

  const {
    data: companies,
    isPending: isCompaniesPending,
    isError: isCompaniesError,
    error: companiesError,
  } = useAllCompaniesPaginated({ CurrentPage: 1, PageSize: 5 });

  const {
    data: users,
    isPending: isUsersPending,
    isError: isUsersError,
    error: usersError,
  } = useAllUsersPaginated({ CurrentPage: 1, PageSize: 5 });

  return (
    <div className="flex flex-col flex-wrap gap-8 mt-8">
      <ItemList
        title="Aziende"
        data={companies?.items ?? []}
        isPending={isCompaniesPending}
        isError={isCompaniesError}
        error={companiesError}
        getline={(item) => item.name}
        getCallout={(item) => item.id}
        getUniqueId={(item) => item.id}
        getRoute={(item) => `/dashboard/companies/${item.id}`}
      />
      <ItemList
        title="Listini"
        data={pricelists?.items ?? []}
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
        data={products?.items ?? []}
        isPending={isProductsPending}
        isError={isProductError}
        error={productErrot}
        getline={(item) => item.currentInstance.name}
        getCallout={(item) => item.productCode}
        getUniqueId={(item) => item.id}
        getRoute={(item) => `/dashboard/products/${item.id}`}
      />
      <ItemList
        title="Utenti"
        data={users?.items ?? []}
        isPending={isUsersPending}
        isError={isUsersError}
        error={usersError}
        getline={(item) => item.username}
        getUniqueId={(item) => item.id}
        getRoute={(item) => `/dashboard/users/${item.id}`}
      />
    </div>
  );
};

export default ItemListGroupAdmin;
