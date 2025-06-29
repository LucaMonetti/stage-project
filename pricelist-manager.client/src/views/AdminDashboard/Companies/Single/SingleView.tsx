import { Link, useNavigate, useParams } from "react-router";
import {
  ProductArraySchema,
  ProductSchema,
  type Product,
} from "../../../../models/Product";
import BasicLoader from "../../../../components/Loader/BasicLoader";
import { FaPencil, FaDownload } from "react-icons/fa6";
import InfoWidget from "../../../../components/SinglePage/Widgets/InfoWidget";
import { useGet } from "../../../../hooks/useGenericFetch";
import {
  PricelistArraySchema,
  PricelistSchema,
  type Pricelist,
} from "../../../../models/Pricelist";
import TableWidget from "../../../../components/SinglePage/Widgets/TableWidget";
import { CompanyArraySchema, CompanySchema } from "../../../../models/Company";
import DefinitionListWidget from "../../../../components/SinglePage/Widgets/DefinitionListWidget";

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
            Icon: FaPencil,
            route: `/admin-dashboard/edit/companies/${companyId}`,
            text: "Modifica",
          },
          {
            color: "blue",
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
        data={pricelists}
        columns={[
          {
            key: "id" as keyof Pricelist,
            header: "Codice",
            className: "text-white",
            headerClassName: "text-white",
          },
          {
            key: "name" as keyof Pricelist,
            header: "Nome Prodotto",
            className: "text-white",
            headerClassName: "text-white",
          },
          {
            key: "products" as keyof Pricelist,
            header: "Totale Prodotti",
            render: (value: any[]) => (
              <span>
                {value.length} {value.length == 1 ? "prodotto" : "prodotti"}
              </span>
            ),
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
        data={productsData}
        columns={[
          {
            key: "id" as keyof Product,
            header: "Codice Prodotto",
            className: "text-white",
            headerClassName: "text-white",
          },
          {
            key: "currentInstance.name" as keyof Product,
            header: "Nome Prodotto",
            className: "text-white",
            headerClassName: "text-white",
          },
          {
            key: "currentInstance.price" as keyof Product,
            header: "Prezzo",
            className: "font-medium text-green-600",
            render: (value: number) => `${value.toFixed(2)} €`,
          },
          {
            key: "currentInstance.cost" as keyof Product,
            header: "Costo",
            className: "font-medium text-red-600",
            render: (value: number) => `${value.toFixed(2)} €`,
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
