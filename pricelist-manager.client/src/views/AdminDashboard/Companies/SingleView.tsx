import { Link, useNavigate, useParams } from "react-router";
import BasicLoader from "../../../components/Loader/BasicLoader";
import { FaPencil, FaDownload, FaPlus } from "react-icons/fa6";
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

const SingleCompanyView = () => {
  const { companyId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<PricelistFilter>({
    company_id: "CON",
  });
  const [nameInput, setNameInput] = useState("");

  const debouncedNameInput = useDebounce(nameInput, 800);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      name: debouncedNameInput || undefined,
    }));
    setCurrentPage(1);
  }, [debouncedNameInput]);

  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin()) navigate("/auth/login");

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

  if (isCompanyPending) {
    return (
      <div className="px-8 py-4 flex justify-center align-center h-full">
        <BasicLoader />
      </div>
    );
  }

  if (companyError) {
    navigate("/error/404");
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
            handler: async () => {
              const url = `/api/v1/export/companies/${companyId}`;

              let res = await fetch(url, {
                method: "GET",
                headers: {
                  Accept: "application/csv",
                  "Content-Type": "application/csv",
                },
              });

              if (res.ok) {
                const blob = await res.blob();
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.setAttribute("download", `${company?.name}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
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
