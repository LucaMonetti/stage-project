import { useEffect, useState } from "react";
import ItemList from "./ItemList";
import type { Product } from "../../../models/Product";

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};

const ItemListGroup = () => {
  const [products, setProducts] = useState<Product[]>();
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [errorProducts, setErrorProducts] = useState<string>();

  const fetchData = async () => {
    setLoadingProducts(true);
    setTimeout(async () => {
      try {
        const endpoint = `api/pricelists/3fa85f64-5717-4562-b3fc-2c963f66afa7/products`;
        const response = await fetch(endpoint, API_OPTIONS);

        if (!response.ok) {
          throw new Error("Failed to fetch API!");
        }

        const data = await response.json();
        let parsed: Product[] = [];
        data.forEach(
          (item: {
            latestVersion: number;
            productCode: string;
            versions: [{ name: string; description: string; price: number }];
          }) => {
            parsed.push({
              id: item.latestVersion + "-" + item.productCode,
              Name: item.versions[0].name,
              Description: item.versions[0].description,
              Price: item.versions[0].price,
            } satisfies Product);
          }
        );

        setProducts(parsed);
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
      <ItemList
        title="Prodotti"
        fetch={{
          isLoading: loadingProducts,
          data: products,
          errorMsg: errorProducts,
        }}
      />
    </div>
  );
};

export default ItemListGroup;
