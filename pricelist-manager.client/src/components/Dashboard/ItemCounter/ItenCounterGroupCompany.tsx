import {
  usePricelistStatisticsByCompany,
  useProductStatisticsByCompany,
} from "../../../hooks/statistics/useQueryStatistics";
import { useAuth } from "../../Authentication/AuthenticationProvider";
import ItemCounter from "./ItemCounter";
import { FaListUl } from "react-icons/fa6";

function ItenCounterGroupCompany() {
  const { user } = useAuth();

  const {
    data: products,
    isPending: isProductPending,
    isError: isProductError,
    error: productError,
  } = useProductStatisticsByCompany(user?.company.id || "");

  const {
    data: pricelists,
    isPending: isPricelistsPending,
    isError: isPricelistsError,
    error: pricelistsError,
  } = usePricelistStatisticsByCompany(user?.company.id || "");

  return (
    <div className="flex flex-wrap gap-8 mt-8">
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
        description={"Prodotti disponibili"}
        getBodyText={(item) => item?.uniqueCount.toString()}
        createLink="create/products"
      />
    </div>
  );
}

export default ItenCounterGroupCompany;
