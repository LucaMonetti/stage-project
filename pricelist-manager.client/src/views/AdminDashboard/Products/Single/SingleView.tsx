import { useNavigate, useParams } from "react-router";
import { ProductSchema } from "../../../../models/Product";
import BasicLoader from "../../../../components/Loader/BasicLoader";
import { FaPencil, FaDownload } from "react-icons/fa6";
import InfoWidget from "../../../../components/SinglePage/Widgets/InfoWidget";
import MoneyWidget from "../../../../components/SinglePage/Widgets/MoneyWidget";
import DefinitionListWidget from "../../../../components/SinglePage/Widgets/DefinitionListWidget";
import VersionWidget from "../../../../components/SinglePage/Widgets/VersionWidget";
import { useFetch } from "../../../../hooks/useGenericFetch";

const SingleProductView = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const product = useFetch({
    method: "GET",
    endpoint: `products/${productId}`,
    schema: ProductSchema,
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
        title={product.data?.currentInstance.name}
        subtitle={product.data?.currentInstance.description}
        callout={`Versione ${product.data?.latestVersion}`}
        actions={[
          {
            color: "purple",
            Icon: FaPencil,
            route: `/admin-dashboard/edit/products/${productId}`,
            text: "Modifica",
          },
          {
            color: "blue",
            Icon: FaDownload,
            route: `/admin-dashboard/download/products/${productId}`,
            text: "Scarica",
          },
        ]}
      />
      <MoneyWidget
        title="Prezzo corrente"
        amount={product.data?.currentInstance.price}
      />
      <MoneyWidget
        title="Costo corrente"
        amount={product.data?.currentInstance.cost}
        color="red"
        dimensions={{
          default: { startCol: 1, endCol: 5 },
          md: { startCol: 3 },
        }}
      />

      <DefinitionListWidget
        title="Listino"
        values={[
          { title: "Nome", value: product.data?.pricelist.name },
          {
            title: "Codice",
            value: product.data?.pricelist.id,
          },
          {
            title: "Azienda",
            value: product.data?.company.id,
          },
        ]}
      />

      <DefinitionListWidget
        title="Informazioni aggiuntive"
        values={[
          {
            title: "Mastrino",
            value: product.data?.currentInstance.accountingControl,
          },
          {
            title: "CDA",
            value: product.data?.currentInstance.cda,
          },
          {
            title: "Voce Vendita",
            value: product.data?.currentInstance.salesItem,
          },
        ]}
      />

      <VersionWidget
        versions={product.data?.versions}
        lastVersion={product.data?.latestVersion}
      />
    </div>
  );
};

export default SingleProductView;
