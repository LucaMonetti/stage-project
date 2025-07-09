import { useNavigate, useParams } from "react-router";
import BasicLoader from "../../../components/Loader/BasicLoader";
import { FaPencil, FaDownload, FaPlus } from "react-icons/fa6";
import InfoWidget from "../../../components/SinglePage/Widgets/InfoWidget";
import TableWidget from "../../../components/SinglePage/Widgets/TableWidget";
import type { CustomColumnDef } from "../../../components/Dashboard/Tables/GenericTableView";
import { Status } from "../../../types";
import type { UpdateListProduct } from "../../../models/UpdateListProduct";
import {
  useProductsByStatus,
  useUpdateList,
} from "../../../hooks/updatelists/useQueryUpdatelists";

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

  const { data, isPending, isError } = useUpdateList(updateListId ?? "");

  const {
    data: toUpdateProducts,
    isLoading: isToUpdateProductsLoading,
    isError: isToUpdateProductsError,
    error: toUpdateProductsError,
  } = useProductsByStatus(updateListId ?? "", Status.Pending);
  const {
    data: updatedProducts,
    isLoading: isUpdatedProductsLoading,
    isError: isUpdatedProductsError,
    error: updatedProductsError,
  } = useProductsByStatus(updateListId ?? "", Status.Edited);

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
        callout={`Completamento: ${(
          ((data?.editedProducts ?? 0) / (data?.totalProducts ?? 1)) *
          100
        ).toFixed(1)}%`}
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
            route: `/admin-dashboard/updatelists/${updateListId}/products`,
          },
        ]}
        data={toUpdateProducts ?? []}
        isPending={isToUpdateProductsLoading}
        isError={isToUpdateProductsError}
        error={toUpdateProductsError}
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
        data={updatedProducts ?? []}
        isPending={isUpdatedProductsLoading}
        isError={isUpdatedProductsError}
        error={updatedProductsError}
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
