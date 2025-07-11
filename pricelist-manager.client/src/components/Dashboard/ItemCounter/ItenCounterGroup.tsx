import {
  useCompanyStatistics,
  usePricelistStatistics,
  useProductStatistics,
  useUserStatistics,
} from "../../../hooks/statistics/useQueryStatistics";
import ItemCounter from "./ItemCounter";
import { FaBuilding, FaListUl, FaUser } from "react-icons/fa6";

function ItenCounterGroup() {
  const {
    data: products,
    isPending: isProductPending,
    isError: isProductError,
    error: productError,
  } = useProductStatistics();

  const {
    data: pricelists,
    isPending: isPricelistsPending,
    isError: isPricelistsError,
    error: pricelistsError,
  } = usePricelistStatistics();

  const {
    data: companies,
    isPending: isCompaniesPending,
    isError: isCompaniesError,
    error: companiesError,
  } = useCompanyStatistics();

  const {
    data: users,
    isPending: isUsersPending,
    isError: isUsersError,
    error: usersError,
  } = useUserStatistics();

  return (
    <div className="flex flex-wrap gap-8 mt-8">
      <ItemCounter
        data={companies}
        isPending={isCompaniesPending}
        isError={isCompaniesError}
        error={companiesError}
        title={"Aziende"}
        color="purple"
        description={"Aziende registrate nel sistema"}
        Icon={FaBuilding}
        getBodyText={(item) => item?.totalRegistered.toString()}
        createLink="create/companies"
      />
      <ItemCounter
        data={pricelists}
        isPending={isPricelistsPending}
        isError={isPricelistsError}
        error={pricelistsError}
        title={"Listini"}
        color="green"
        description={"Totale listini creati"}
        Icon={FaListUl}
        getBodyText={(item) => item?.totalRegistered.toString()}
        createLink="create/pricelists"
      />
      <ItemCounter
        data={products}
        isPending={isProductPending}
        isError={isProductError}
        error={productError}
        title={"Prodotti"}
        color="blue"
        description={"Prodotti unici disponibili"}
        getBodyText={(item) => item?.uniqueCount.toString()}
        createLink="create/products"
      />
      <ItemCounter
        data={users}
        isPending={isUsersPending}
        isError={isUsersError}
        error={usersError}
        title={"Utenti"}
        Icon={FaUser}
        color="yellow"
        description={`Utenti registrati`}
        getBodyText={(item) => `${item?.totalRegistered}`}
        createLink="create/users"
      />
    </div>
  );
}

export default ItenCounterGroup;
