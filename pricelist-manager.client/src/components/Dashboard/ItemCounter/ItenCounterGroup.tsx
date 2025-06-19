import { useState, useEffect } from "react";
import type { BaseDBStatistics } from "../../../models/BaseDBElement";
import ItemCounter from "./ItemCounter";

import { FaBuilding, FaListUl } from "react-icons/fa6";

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};

function ItenCounterGroup() {
  const [products, setProducts] = useState<BaseDBStatistics>();
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [errorProducts, setErrorProducts] = useState<string>();

  const fetchData = async () => {
    setLoadingProducts(true);
    setTimeout(async () => {
      try {
        const endpoint = `/api/statistics/products`;
        const response = await fetch(endpoint, API_OPTIONS);

        if (!response.ok) {
          throw new Error("Failed to fetch API!");
        }

        const data = await response.json();

        setProducts({ totalNumber: data.totalUniqueProducts });
      } catch (error) {
        console.error(`Error fetching API: ${error}`);
        setErrorProducts("Error fetching API. Please try again later.");
      } finally {
        console.log("Finally executed!");
        setLoadingProducts(false);
      }
    }, 1000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-wrap gap-8 mt-8">
      <ItemCounter<BaseDBStatistics>
        fetch={{
          isLoading: loadingProducts,
          errorMsg: errorProducts,
          data: products,
        }}
        title={"Aziende"}
        color="purple"
        description={"Aziende registrate nel sistema"}
        Icon={FaBuilding}
        getBodyText={(item) => item?.totalNumber.toString()}
      />
      <ItemCounter<BaseDBStatistics>
        fetch={{
          isLoading: loadingProducts,
          errorMsg: errorProducts,
          data: products,
        }}
        title={"Listini"}
        color="green"
        description={"Totale listini creati"}
        Icon={FaListUl}
        getBodyText={(item) => item?.totalNumber.toString()}
      />
      <ItemCounter<BaseDBStatistics>
        fetch={{
          isLoading: loadingProducts,
          errorMsg: errorProducts,
          data: products,
        }}
        title={"Prodotti"}
        color="blue"
        description={"Prodotti unici disponibili"}
        getBodyText={(item) => item?.totalNumber.toString()}
      />
    </div>
  );
}

export default ItenCounterGroup;
