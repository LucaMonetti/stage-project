import { Link, useNavigate, useParams } from "react-router";
import { ProductArraySchema, type Product } from "../../../models/Product";
import BasicLoader from "../../../components/Loader/BasicLoader";
import { FaPencil, FaDownload, FaPlus } from "react-icons/fa6";
import InfoWidget from "../../../components/SinglePage/Widgets/InfoWidget";
import { useGet } from "../../../hooks/useGenericFetch";
import {
  PricelistArraySchema,
  type Pricelist,
} from "../../../models/Pricelist";
import TableWidget from "../../../components/SinglePage/Widgets/TableWidget";
import { CompanySchema } from "../../../models/Company";
import DefinitionListWidget from "../../../components/SinglePage/Widgets/DefinitionListWidget";
import type {
  Column,
  CustomColumnDef,
} from "../../../components/Dashboard/Tables/GenericTableView";

const SingleCompanyView = () => {
  const navigate = useNavigate();
  const { companyId } = useParams();
  const company = useGet({
    method: "GET",
    endpoint: `companies/${companyId}`,
    schema: CompanySchema,
  });

  const productsData = useGet({
    method: "GET",
    endpoint: `companies/${companyId}/products`,
    schema: ProductArraySchema,
  });

  const pricelists = useGet({
    method: "GET",
    endpoint: `companies/${companyId}/pricelists`,
    schema: PricelistArraySchema,
  });

  if (company.isLoading) {
    return (
      <div className="px-8 py-4 flex justify-center align-center h-full">
        <BasicLoader />
      </div>
    );
  }

  if (company.errorMsg) {
    navigate("/error/404");
  }

  return (
    <div className="px-8 py-8 grid grid-cols-4 gap-4">
      <InfoWidget
        title={`${company.data?.id} - ${company.data?.name}`}
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
            value: company.data?.name,
          },
          {
            title: "Telefono",
            value: (
              <Link to={`tel:${company.data?.phone}`}>
                {company.data?.phone}
              </Link>
            ),
          },
          {
            title: "Indirizzo",
            value: company.data?.address,
          },
          {
            title: "Provincia",
            value: company.data?.province,
          },
          {
            title: "Codice Postale",
            value: company.data?.postalCode,
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

export default SingleCompanyView;
