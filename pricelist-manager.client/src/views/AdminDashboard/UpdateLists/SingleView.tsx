import { useNavigate, useParams } from "react-router";
import { ProductArraySchema, type Product } from "../../../models/Product";
import BasicLoader from "../../../components/Loader/BasicLoader";
import { FaPencil, FaDownload, FaPlus } from "react-icons/fa6";
import InfoWidget from "../../../components/SinglePage/Widgets/InfoWidget";
import { useGet } from "../../../hooks/useGenericFetch";
import { PricelistSchema } from "../../../models/Pricelist";
import TableWidget from "../../../components/SinglePage/Widgets/TableWidget";
import type { Column } from "../../../components/Dashboard/Tables/GenericTableView";

const UpdateListSingleView = () => {
  const navigate = useNavigate();
  const { pricelistId } = useParams();
  const product = useGet({
    method: "GET",
    endpoint: `pricelists/${pricelistId}`,
    schema: PricelistSchema,
  });

  const productsData = useGet({
    method: "GET",
    endpoint: `pricelists/${pricelistId}/products`,
    schema: ProductArraySchema,
  });

  if (product.isLoading) {
    return (
      <div className="px-8 py-4 flex justify-center align-center h-full">
        <BasicLoader />
      </div>
    );
  }

  if (product.errorMsg) {
    navigate("/error/404");
  }

  return (
    <div className="px-8 py-8 grid grid-cols-4 gap-4">
      <InfoWidget
        title={product.data?.name}
        subtitle={product.data?.description}
        callout={`Totale Prodotti: ${product.data?.products?.length ?? 0}`}
        actions={[
          {
            color: "purple",
            Icon: FaPencil,
            route: `/admin-dashboard/edit/pricelists/${pricelistId}`,
            text: "Modifica",
          },
          {
            color: "blue",
            Icon: FaDownload,
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
            route: `/admin-dashboard/create/products?pricelistId=${pricelistId}`,
          },
        ]}
        data={productsData}
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

export default UpdateListSingleView;
