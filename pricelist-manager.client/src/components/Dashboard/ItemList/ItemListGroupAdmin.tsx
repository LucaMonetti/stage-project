import { useAllCompanies } from "../../../hooks/companies/useQueryCompanies";
import { useAllPricelists } from "../../../hooks/pricelists/useQueryPricelists";
import { useAllProducts } from "../../../hooks/products/useQueryProducts";
import { useFetch } from "../../../hooks/useFetch";
import { useAllUsers } from "../../../hooks/users/useQueryUsers";
import { CompanyArraySchema } from "../../../models/Company";
import { PricelistArraySchema } from "../../../models/Pricelist";
import { ProductArraySchema } from "../../../models/Product";
import { UserArraySchema } from "../../../models/User";
import ItemList from "./ItemList";

const ItemListGroupAdmin = () => {
  const {
    data: products,
    isPending: isProductsPending,
    isError: isProductError,
    error: productErrot,
  } = useAllProducts();

  const {
    data: pricelists,
    isPending: isPricelistsPending,
    isError: isPricelistsError,
    error: pricelistsError,
  } = useAllPricelists();

  const {
    data: companies,
    isPending: isCompaniesPending,
    isError: isCompaniesError,
    error: companiesError,
  } = useAllCompanies();

  const {
    data: users,
    isPending: isUsersPending,
    isError: isUsersError,
    error: usersError,
  } = useAllUsers();

  return (
    <div className="flex flex-col flex-wrap gap-8 mt-8">
      <ItemList
        title="Aziende"
        data={companies ?? []}
        isPending={isCompaniesPending}
        isError={isCompaniesError}
        error={companiesError}
        getline={(item) => item.name}
        getCallout={(item) => item.id}
        getUniqueId={(item) => item.id}
        getRoute={(item) => `/admin-dashboard/companies/${item.id}`}
      />
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
        getRoute={(item) => `/admin-dashboard/pricelists/${item.id}`}
      />
      <ItemList
        title="Prodotti"
        data={products ?? []}
        isPending={isProductsPending}
        isError={isProductError}
        error={productErrot}
        getline={(item) => item.currentInstance.name}
        getCallout={(item) => item.productCode}
        getUniqueId={(item) => item.id}
        getRoute={(item) => `/admin-dashboard/products/${item.id}`}
      />
      <ItemList
        title="Utenti"
        data={users ?? []}
        isPending={isUsersPending}
        isError={isUsersError}
        error={usersError}
        getline={(item) => item.username}
        getUniqueId={(item) => item.id}
        getRoute={(item) => `/admin-dashboard/users/${item.id}`}
      />
    </div>
  );
};

export default ItemListGroupAdmin;
