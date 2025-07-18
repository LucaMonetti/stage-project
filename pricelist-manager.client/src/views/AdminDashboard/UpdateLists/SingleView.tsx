import { useNavigate, useParams } from "react-router";
import BasicLoader from "../../../components/Loader/BasicLoader";
import { FaPencil, FaDownload, FaPlus, FaTrash } from "react-icons/fa6";
import InfoWidget from "../../../components/SinglePage/Widgets/InfoWidget";
import TableWidget from "../../../components/SinglePage/Widgets/TableWidget";
import type { CustomColumnDef } from "../../../components/Dashboard/Tables/GenericTableView";
import { Status } from "../../../types";
import type { UpdateListProduct } from "../../../models/UpdateListProduct";
import {
  useProductsByStatus,
  useUpdateList,
} from "../../../hooks/updatelists/useQueryUpdatelists";
import ActionRenderer, {
  type Action,
} from "../../../components/Buttons/ActionRenderer";
import { useDeleteUpdatelistProduct } from "../../../hooks/updatelists/useMutationUpdateList";
import { useEffect, useState } from "react";
import { useExportCSV } from "../../../hooks/exports/useExportQuery";
import { useAuth } from "../../../components/Authentication/AuthenticationProvider";

const UpdateListSingleView = () => {
  const navigate = useNavigate();
  const { updateListId } = useParams();
  const { isAdmin, user } = useAuth();

  const [exportData, setExportData] = useState<boolean>(false);
  const exportCSV = useExportCSV(`updatelists/${updateListId}`, {
    enabled: exportData,
  });

  useEffect(() => {
    setExportData(false);
  }, [exportCSV.isSuccess]);

  const { data, isPending, isError } = useUpdateList(updateListId ?? "");
  const deleteMutation = useDeleteUpdatelistProduct();

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

  let actions: Action[] = [
    {
      color: "blue",
      type: "button",
      Icon: FaDownload,
      handler: () => {
        setExportData(true);
      },
      text: "Scarica",
    },
  ];

  if (isAdmin()) {
    actions.unshift({
      color: "purple",
      type: "link",
      Icon: FaPencil,
      route: `/dashboard/edit/updatelists/${updateListId}`,
      text: "Modifica",
    });
  }

  useEffect(() => {
    if (!(isAdmin() || user?.company.id === data?.companyId))
      navigate("/auth/login");

    if (isError) {
      navigate("/error/404");
    }
  }, [user, data, isError]);

  if (isPending) {
    return (
      <div className="px-8 py-4 flex justify-center align-center h-full">
        <BasicLoader />
      </div>
    );
  }

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
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const { id } = row.original;

        return (
          <div className="flex gap-4">
            <ActionRenderer
              actions={[
                {
                  Icon: FaTrash,
                  type: "button",
                  color: "red",
                  modalConfig: {
                    title: "Eliminare la lista?",
                    description: "Sei sicuro di voler eliminare questa lista?",
                  },
                  handler: async () => {
                    deleteMutation.mutate({
                      updateListId: updateListId ?? "",
                      productId: id,
                    });
                  },
                },
              ]}
            />
          </div>
        );
      },
    },
  ] satisfies CustomColumnDef<UpdateListProduct>[];

  return (
    <div className="px-8 py-8 grid grid-cols-4 gap-4">
      <InfoWidget
        title={data?.name}
        subtitle={data?.description}
        callout={`Completamento: ${(data?.editedProducts == data?.totalProducts
          ? 100
          : ((data?.editedProducts ?? 0) / (data?.totalProducts ?? 1)) * 100
        ).toFixed(1)}%`}
        actions={actions}
      />

      <TableWidget
        title="Prodotti da aggiornare"
        actions={[
          {
            color: "blue",
            type: "link",
            Icon: FaPlus,
            route: `/dashboard/updatelists/${updateListId}/products`,
          },
        ]}
        data={toUpdateProducts ?? []}
        isPending={isToUpdateProductsLoading}
        isError={isToUpdateProductsError}
        error={toUpdateProductsError}
        columns={productCols}
        config={{
          baseUrl: `/dashboard/edit/products/:pid?editUpdateList=${updateListId}`,
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
          baseUrl: "/dashboard/products/:pid",
          enableLink: true,
          columnId: { ":pid": "id" },
        }}
        keyField="id"
      />
    </div>
  );
};

export default UpdateListSingleView;
