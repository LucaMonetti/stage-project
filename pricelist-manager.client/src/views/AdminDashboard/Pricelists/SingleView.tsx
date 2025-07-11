import { useNavigate, useParams } from "react-router";
import { ProductArraySchema, type Product } from "../../../models/Product";
import BasicLoader from "../../../components/Loader/BasicLoader";
import { FaPencil, FaDownload, FaPlus } from "react-icons/fa6";
import InfoWidget from "../../../components/SinglePage/Widgets/InfoWidget";
import { useGet } from "../../../hooks/useGenericFetch";
import { PricelistSchema } from "../../../models/Pricelist";
import TableWidget from "../../../components/SinglePage/Widgets/TableWidget";
import type { Column } from "../../../components/Dashboard/Tables/GenericTableView";
import {
  useAllPricelists,
  usePricelist,
} from "../../../hooks/pricelists/useQueryPricelists";
import { useAllProductByPricelist } from "../../../hooks/products/useQueryProducts";

const SinglePricelistView = () => {
  const navigate = useNavigate();
  const { pricelistId } = useParams();

  const { data, isPending, error, isError } = usePricelist(pricelistId ?? "");

  const {
    data: productsData,
    isPending: isProductsPending,
    isError: isProductsError,
    error: productsError,
  } = useAllProductByPricelist(pricelistId ?? "");

  if (isPending) {
    return (
      <div className="px-8 py-4 flex justify-center align-center h-full">
        <BasicLoader />
      </div>
    );
  }

  if (isError) {
    navigate("/error/404");
  }

  return (
    <div className="px-8 py-8 grid grid-cols-4 gap-4">
      <InfoWidget
        title={data?.name}
        subtitle={data?.description}
        callout={`Totale Prodotti: ${data?.products?.length ?? 0}`}
        actions={[
          {
            color: "purple",
            Icon: FaPencil,
            type: "link",
            route: `/admin-dashboard/edit/pricelists/${pricelistId}`,
            text: "Modifica",
          },
          {
            color: "blue",
            Icon: FaDownload,
            type: "link",
            route: `/admin-dashboard/download/pricelists/${pricelistId}`,
            text: "Scarica",
          },
        ]}
      />

      <TableWidget
        title="Prodotti Registrati"
        actions={[
          {
            color: "blue",
            Icon: FaPlus,
            type: "link",
            route: `/admin-dashboard/create/products?pricelistId=${pricelistId}`,
          },
        ]}
        data={productsData ?? []}
        isPending={isProductsPending}
        isError={isProductsError}
        error={productsError}
        columns={[
          {
            accessorKey: "id",
            header: "Codice Prodotto",
            meta: {
              className: "text-white",
              headerClassName: "text-white",
            },
          },
          {
            accessorKey: "currentInstance.name",
            header: "Nome Prodotto",
            meta: {
              className: "text-white",
              headerClassName: "text-white",
            },
          },
          {
            accessorKey: "currentInstance.price",
            header: "Prezzo",
            meta: {
              className: "font-medium text-green-600",
            },
            cell: ({ getValue }) => {
              const value = getValue() as number;
              return `${value.toFixed(2)} €`;
            },
          },
          {
            accessorKey: "currentInstance.cost",
            header: "Costo",
            meta: {
              className: "font-medium text-red-600",
            },
            cell: ({ getValue }) => {
              const value = getValue() as number;
              return `${value.toFixed(2)} €`;
            },
          },
        ]}
        config={{
          baseUrl: "/admin-dashboard/products/:pid",
          enableLink: true,
          columnId: { ":pid": "id" },
        }}
        keyField="id"
      />
    </div>
  );
};

export default SinglePricelistView;
