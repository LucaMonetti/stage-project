import { Link, useNavigate, useParams } from "react-router";
import BasicLoader from "../../../components/Loader/BasicLoader";
import { FaPencil, FaDownload, FaPlus } from "react-icons/fa6";
import InfoWidget from "../../../components/SinglePage/Widgets/InfoWidget";
import TableWidget from "../../../components/SinglePage/Widgets/TableWidget";
import DefinitionListWidget from "../../../components/SinglePage/Widgets/DefinitionListWidget";
import { useCompany } from "../../../hooks/companies/useQueryCompanies";
import { useAllProductsByCompany } from "../../../hooks/products/useQueryProducts";
import { useAllPricelistsByCompany } from "../../../hooks/pricelists/useQueryPricelists";
import { useAuth } from "../../../components/Authentication/AuthenticationProvider";

const SingleCompanyView = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin()) navigate("/auth/login");

  const { companyId } = useParams();

  const {
    data: company,
    isPending: isCompanyPending,
    error: companyError,
  } = useCompany(companyId ?? "");

  const {
    data: products,
    isPending: isProductsPending,
    error: productsError,
  } = useAllProductsByCompany(companyId ?? "");

  const {
    data: pricelists,
    isPending: isPricelistsPending,
    error: pricelistsError,
  } = useAllPricelistsByCompany(companyId ?? "");

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
            route: `/admin-dashboard/edit/companies/${companyId}`,
            text: "Modifica",
          },
          {
            color: "blue",
            type: "link",
            Icon: FaDownload,
            route: `/admin-dashboard/download/companies/${companyId}`,
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
            route: `/admin-dashboard/create/pricelists?companyId=${companyId}`,
          },
        ]}
        data={pricelists}
        isPending={isPricelistsPending}
        isError={!!pricelistsError}
        error={pricelistsError}
        columns={[
          {
            accessorKey: "id",
            header: "Codice",
            meta: {
              className: "text-white",
              headerClassName: "text-white",
            },
          },
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
          baseUrl: "/admin-dashboard/pricelists/:pid",
          enableLink: true,
          columnId: { ":pid": "id" },
        }}
        keyField="id"
      />

      <TableWidget
        title="Prodotti Associati"
        actions={[
          {
            color: "blue",
            type: "link",
            Icon: FaPlus,
            route: `/admin-dashboard/create/products?companyId=${companyId}`,
          },
        ]}
        data={products ?? []}
        isPending={isProductsPending}
        isError={!!productsError}
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

export default SingleCompanyView;
