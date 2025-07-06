import { useNavigate, useParams } from "react-router";
import { ProductArraySchema, type Product } from "../../../models/Product";
import BasicLoader from "../../../components/Loader/BasicLoader";
import { FaPencil, FaDownload, FaPlus } from "react-icons/fa6";
import InfoWidget from "../../../components/SinglePage/Widgets/InfoWidget";
import { useGet } from "../../../hooks/useGenericFetch";
import { PricelistSchema } from "../../../models/Pricelist";
import TableWidget from "../../../components/SinglePage/Widgets/TableWidget";
import type {
  Column,
  CustomColumnDef,
} from "../../../components/Dashboard/Tables/GenericTableView";
import { UpdateListSchema, type UpdateList } from "../../../models/UpdateList";
import { Status, type FetchData } from "../../../types";
import type { UpdateListProduct } from "../../../models/UpdateListProduct";

const productCols = [
  {
    accessorKey: "id",
    header: "Codice Prodotto",
    meta: {
      className: "whitespace-nowrap",
    },
  },
  {
    accessorKey: "currentInstance.name",
    header: "Nome Prodotto",
  },
  {
    accessorKey: "currentInstance.price",
    header: "Prezzo",
    meta: {
      className: "font-medium text-green-600 whitespace-nowrap",
    },
    accessorFn: (row: UpdateListProduct) =>
      `${row.currentInstance.price.toFixed(2)} €`,
  },
  {
    accessorKey: "currentInstance.cost",
    header: "Costo",
    meta: {
      className: "font-medium text-red-600 whitespace-nowrap",
    },
    accessorFn: (row: UpdateListProduct) =>
      `${row.currentInstance.cost.toFixed(2)} €`,
  },
] satisfies CustomColumnDef<UpdateListProduct>[];

const UpdateListSingleView = () => {
  const navigate = useNavigate();
  const { updateListId } = useParams();

  const updateList = useGet({
    method: "GET",
    endpoint: `updatelists/${updateListId}`,
    schema: UpdateListSchema,
  });

  const toUpdateProducts: FetchData<UpdateListProduct[]> = {
    isLoading: updateList.isLoading,
    errorMsg: updateList.errorMsg,
    data: updateList.data?.products.filter(
      (item) => item.status == Status.Pending
    ),
  };

  const updatedProducts: FetchData<UpdateListProduct[]> = {
    isLoading: updateList.isLoading,
    errorMsg: updateList.errorMsg,
    data: updateList.data?.products.filter(
      (item) => item.status == Status.Edited
    ),
  };

  // const productsData = useGet({
  //   method: "GET",
  //   endpoint: `pricelists/${pricelistId}/products`,
  //   schema: ProductArraySchema,
  // });

  if (updateList.isLoading) {
    return (
      <div className="px-8 py-4 flex justify-center align-center h-full">
        <BasicLoader />
      </div>
    );
  }

  if (updateList.errorMsg) {
    navigate("/error/404");
  }

  return (
    <div className="px-8 py-8 grid grid-cols-4 gap-4">
      <InfoWidget
        title={updateList.data?.name}
        subtitle={updateList.data?.description}
        callout={`Completamento: ${
          ((updateList.data?.editedProducts ?? 0) /
            (updateList.data?.totalProducts ?? 1)) *
          100
        }%`}
        actions={[
          {
            color: "purple",
            type: "link",
            Icon: FaPencil,
            route: `/admin-dashboard/edit/updatelists/${updateListId}`,
            text: "Modifica",
          },
          {
            color: "blue",
            type: "link",
            Icon: FaDownload,
            route: `/admin-dashboard/download/updatelists/${updateListId}`,
            text: "Scarica",
          },
        ]}
      />

      <TableWidget
        title="Prodotti da aggiornare"
        actions={[
          {
            color: "blue",
            type: "link",
            Icon: FaPlus,
            route: `/admin-dashboard/add/updatelists/{pricelistId}`,
          },
        ]}
        data={toUpdateProducts}
        columns={productCols}
        config={{
          baseUrl: `/admin-dashboard/edit/products/:pid?editUpdateList=${updateListId}`,
          enableLink: true,
          columnId: { ":pid": "id" },
        }}
        keyField="id"
      />

      <TableWidget
        title="Prodotti aggiornati"
        actions={[
          {
            color: "blue",
            type: "link",
            Icon: FaPlus,
            route: `/admin-dashboard/add/updatelists/{pricelistId}`,
          },
        ]}
        data={updatedProducts}
        columns={productCols}
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
