import { useFetch } from "../../../hooks/useFetch";
import {
  ProductStatisticsSchema,
  type ProductStatistics,
} from "../../../models/Product";
import ItemCounter from "./ItemCounter";
import { FaBuilding, FaListUl } from "react-icons/fa6";

function ItenCounterGroup() {
  const prod = useFetch("api/statistics/products", ProductStatisticsSchema);

  return (
    <div className="flex flex-wrap gap-8 mt-8">
      <ItemCounter<ProductStatistics>
        fetch={prod}
        title={"Aziende"}
        color="purple"
        description={"Aziende registrate nel sistema"}
        Icon={FaBuilding}
        getBodyText={(item) => item?.totalRegistered.toString()}
      />
      <ItemCounter<ProductStatistics>
        fetch={prod}
        title={"Listini"}
        color="green"
        description={"Totale listini creati"}
        Icon={FaListUl}
        getBodyText={(item) => item?.totalRegistered.toString()}
      />
      <ItemCounter<ProductStatistics>
        fetch={prod}
        title={"Prodotti"}
        color="blue"
        description={"Prodotti unici disponibili"}
        getBodyText={(item) => item?.uniqueCount.toString()}
      />
    </div>
  );
}

export default ItenCounterGroup;
