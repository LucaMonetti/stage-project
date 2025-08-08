import { Link, useNavigate, useParams } from "react-router";
import BasicLoader from "../../../components/Loader/BasicLoader";
import { FaPencil, FaDownload, FaPlus, FaTrash } from "react-icons/fa6";
import InfoWidget from "../../../components/SinglePage/Widgets/InfoWidget";
import TableWidget from "../../../components/SinglePage/Widgets/TableWidget";
import DefinitionListWidget from "../../../components/SinglePage/Widgets/DefinitionListWidget";
import { useCompany } from "../../../hooks/companies/useQueryCompanies";
import { useAllProductsByCompany } from "../../../hooks/products/useQueryProducts";
import {
  useAllPricelists,
  useAllPricelistsByCompany,
  useAllPricelistsPaginated,
} from "../../../hooks/pricelists/useQueryPricelists";
import { useAuth } from "../../../components/Authentication/AuthenticationProvider";
import { useEffect, useState } from "react";
import type { PricelistFilter } from "../../../models/Pricelist";
import { useDebounce } from "../../../hooks/useDebounce";
import { useExportCSV } from "../../../hooks/exports/useExportQuery";
import ActionRenderer, {
  type Action,
} from "../../../components/Buttons/ActionRenderer";
import { useDeletePricelist } from "../../../hooks/pricelists/useMutationPricelists";

const SingleCompanyView = () => {
  const { companyId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<PricelistFilter>({
    company_id: companyId,
  });
  const [nameInput, setNameInput] = useState("");
  const [exportData, setExportData] = useState<boolean>(false);

  const debouncedNameInput = useDebounce(nameInput, 800);
  const exportCSV = useExportCSV(`companies/${companyId}`, {
    enabled: exportData,
  });

  useEffect(() => {
    setExportData(false);
  }, [exportCSV.isSuccess]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      name: debouncedNameInput || undefined,
    }));
    setCurrentPage(1);
  }, [debouncedNameInput]);

  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const {
    data: company,
    isPending: isCompanyPending,
    error: companyError,
  } = useCompany(companyId ?? "");

  const pricelists = useAllPricelistsPaginated(
    {
      CurrentPage: currentPage,
      PageSize: pageSize,
    },
    filters
  );

  const deleteMutation = useDeletePricelist();

  useEffect(() => {
    if (!(isAdmin() || user?.company.id === company?.id))
      navigate("/auth/login");

    if (companyError) {
      navigate("/error/404");
    }
  }, [user, company, companyError]);

  if (isCompanyPending) {
    return (
      <div className="px-8 py-4 flex justify-center align-center h-full">
        <BasicLoader />
      </div>
    );
  }

  return (
    <div className="px-8 py-8 grid grid-cols-4 gap-4">
      <InfoWidget
        title={`${company?.id} - ${company?.name}`}
        actions={[
          {
            color: "purple",
            type: "link",
            Icon: FaPencil,
            route: `/dashboard/edit/companies/${companyId}`,
            text: "Modifica",
          },
          {
            color: "blue",
            type: "button",
            Icon: FaDownload,
            handler: () => {
              setExportData(true);
            },
            text: "Scarica",
          },
        ]}
      />

      <DefinitionListWidget
        title="Dettagli Azienda"
        values={[
          {
            title: "Ragione Sociale",
            value: company?.name,
          },
          {
            title: "Telefono",
            value: <Link to={`tel:${company?.phone}`}>{company?.phone}</Link>,
          },
          {
            title: "Indirizzo",
            value: company?.address,
          },
          {
            title: "Provincia",
            value: company?.province,
          },
          {
            title: "Codice Postale",
            value: company?.postalCode,
          },
        ]}
      />

      <TableWidget
        title="Listini Associati"
        actions={[
          {
            color: "blue",
            type: "link",
            Icon: FaPlus,
            route: `/dashboard/create/pricelists?companyId=${companyId}`,
          },
        ]}
        data={pricelists.data?.items ?? []}
        isPending={pricelists.isPending}
        isError={pricelists.isError}
        error={pricelists.error}
        columns={[
          {
            accessorKey: "name",
            header: "Nome Prodotto",
            meta: {
              className: "text-white",
              headerClassName: "text-white",
            },
          },
          {
            accessorKey: "products",
            header: "Totale Prodotti",
            cell: ({ getValue }) => {
              const value = getValue() as any[];
              return (
                <span>
                  {value.length} {value.length === 1 ? "prodotto" : "prodotti"}
                </span>
              );
            },
          },
          {
            accessorKey: "actions",
            header: "Azioni",
            cell: ({ row }) => {
              const { id } = row.original;

              const deleteAction: Action = {
                Icon: FaTrash,
                type: "button",
                color: "red",
                modalConfig: {
                  title: "Eliminare la lista?",
                  description: "Sei sicuro di voler eliminare questa lista?",
                },
                handler: async () => {
                  deleteMutation.mutate({ pricelistId: id });
                },
              };

              let actions: Action[] = [];

              if (isAdmin() || user?.company.id === companyId) {
                actions.push(deleteAction);
              }

              return (
                <div className="flex gap-4">
                  <ActionRenderer actions={actions} />
                </div>
              );
            },
          },
        ]}
        config={{
          baseUrl: "/dashboard/pricelists/:pid",
          enableLink: true,
          columnId: { ":pid": "id" },
        }}
        keyField="id"
        pagination={pricelists.data?.pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default SingleCompanyView;
