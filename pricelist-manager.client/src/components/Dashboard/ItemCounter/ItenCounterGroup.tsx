import { useFetch } from "../../../hooks/useFetch";
import { CompanyStatisticsSchema } from "../../../models/CompanyStatistics";
import { PricelistStatisticsSchema } from "../../../models/PricelistStatistics";
import { ProductStatisticsSchema } from "../../../models/ProductStatistics";
import ItemCounter from "./ItemCounter";
import { FaBuilding, FaListUl } from "react-icons/fa6";

function ItenCounterGroup() {
  const products = useFetch("statistics/products", ProductStatisticsSchema);
  const companies = useFetch("statistics/companies", CompanyStatisticsSchema);
  const pricelists = useFetch(
    "statistics/pricelists",
    PricelistStatisticsSchema
  );

  return (
    <div className="flex flex-wrap gap-8 mt-8">
      <ItemCounter
        fetch={companies}
        title={"Aziende"}
        color="purple"
        description={"Aziende registrate nel sistema"}
        Icon={FaBuilding}
        getBodyText={(item) => item?.totalRegistered.toString()}
        createLink="create/companies"
      />
      <ItemCounter
        fetch={pricelists}
        title={"Listini"}
        color="green"
        description={"Totale listini creati"}
        Icon={FaListUl}
        getBodyText={(item) => item?.totalRegistered.toString()}
        createLink="create/pricelists"
      />
      <ItemCounter
        fetch={products}
        title={"Prodotti"}
        color="blue"
        description={"Prodotti unici disponibili"}
        getBodyText={(item) => item?.uniqueCount.toString()}
        createLink="create/products"
      />
    </div>
  );
}

export default ItenCounterGroup;
