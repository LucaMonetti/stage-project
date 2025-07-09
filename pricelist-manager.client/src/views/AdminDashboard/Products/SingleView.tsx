import { FaPencil, FaDownload } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import BasicLoader from "../../../components/Loader/BasicLoader";
import DefinitionListWidget from "../../../components/SinglePage/Widgets/DefinitionListWidget";
import InfoWidget from "../../../components/SinglePage/Widgets/InfoWidget";
import MoneyWidget from "../../../components/SinglePage/Widgets/MoneyWidget";
import VersionWidget from "../../../components/SinglePage/Widgets/VersionWidget";
import { useGet } from "../../../hooks/useGenericFetch";
import { ProductSchema } from "../../../models/Product";
import GraphWidget from "../../../components/SinglePage/Widgets/GraphWidget";

const SingleProductView = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const product = useGet({
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
            type: "link",
            route: `/admin-dashboard/edit/products/${productId}`,
            text: "Modifica",
          },
          {
            color: "blue",
            type: "link",
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

      <GraphWidget
        title="Andamento Prezzi / Costi"
        dataset={product.data?.versions ?? []}
        getData={(item) => ({
          y: item.updatedAt,
          x: {
            price: item.price,
            cost: item.cost,
            margin: (item.cost * item.margin).toFixed(2),
          },
        })}
        lineCols={[
          {
            dataKey: "x.price",
            stroke: "green",
            name: "Prezzo",
          },
          {
            dataKey: "x.cost",
            stroke: "red",
            name: "Costo",
          },
          {
            dataKey: "x.margin",
            stroke: "yellow",
            name: "Margine",
            strokeDashed: true,
            dot: false,
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
