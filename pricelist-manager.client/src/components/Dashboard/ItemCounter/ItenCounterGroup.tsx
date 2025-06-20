import { useFetch } from "../../../hooks/useFetch";
import { CompanyStatisticsSchema } from "../../../models/Company";
import { PricelistStatisticsSchema } from "../../../models/Pricelist";
import { ProductStatisticsSchema } from "../../../models/Product";
import ItemCounter from "./ItemCounter";
import { FaBuilding, FaListUl } from "react-icons/fa6";

function ItenCounterGroup() {
  const products = useFetch("api/statistics/products", ProductStatisticsSchema);
  const companies = useFetch(
    "api/statistics/companies",
    CompanyStatisticsSchema
  );
  const pricelists = useFetch(
    "api/statistics/pricelists",
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
      />
      <ItemCounter
        fetch={pricelists}
        title={"Listini"}
        color="green"
        description={"Totale listini creati"}
        Icon={FaListUl}
        getBodyText={(item) => item?.totalRegistered.toString()}
      />
      <ItemCounter
        fetch={products}
        title={"Prodotti"}
        color="blue"
        description={"Prodotti unici disponibili"}
        getBodyText={(item) => item?.uniqueCount.toString()}
      />
    </div>
  );
}

export default ItenCounterGroup;
