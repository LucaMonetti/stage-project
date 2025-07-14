import { FaPencil, FaDownload } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import BasicLoader from "../../../components/Loader/BasicLoader";
import DefinitionListWidget from "../../../components/SinglePage/Widgets/DefinitionListWidget";
import InfoWidget from "../../../components/SinglePage/Widgets/InfoWidget";
import MoneyWidget from "../../../components/SinglePage/Widgets/MoneyWidget";
import VersionWidget from "../../../components/SinglePage/Widgets/VersionWidget";
import GraphWidget from "../../../components/SinglePage/Widgets/GraphWidget";
import { useProduct } from "../../../hooks/products/useQueryProducts";
import type { Action } from "../../../components/Buttons/ActionRenderer";
import { useAuth } from "../../../components/Authentication/AuthenticationProvider";

const SingleProductView = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { isAdmin, user } = useAuth();

  const { data, isPending, error, isError } = useProduct(productId ?? "");

  if (isPending) {
    return (
      <div className="px-8 py-4 flex justify-center align-center h-full">
        <BasicLoader />
      </div>
    );
  }

  const actions: Action[] = [
    {
      color: "blue",
      type: "link",
      Icon: FaDownload,
      route: `/dashboard/download/products/${productId}`,
      text: "Scarica",
    },
  ];

  if (isAdmin() || user?.company.id === data?.company.id) {
    actions.unshift({
      color: "purple",
      Icon: FaPencil,
      type: "link",
      route: `/dashboard/edit/products/${productId}`,
      text: "Modifica",
    });
  }

  if (isError) {
    navigate("/error/404");
  }

  return (
    <div className="px-8 py-8 grid grid-cols-4 gap-4">
      <InfoWidget
        title={data?.currentInstance.name}
        subtitle={data?.currentInstance.description}
        callout={`Versione ${data?.latestVersion}`}
        actions={actions}
      />
      <MoneyWidget
        title="Prezzo corrente"
        amount={data?.currentInstance.price}
      />
      <MoneyWidget
        title="Costo corrente"
        amount={data?.currentInstance.cost}
        color="red"
        dimensions={{
          default: { startCol: 1, endCol: 5 },
          md: { startCol: 3 },
        }}
      />

      <DefinitionListWidget
        title="Listino"
        values={[
          { title: "Nome", value: data?.pricelist.name },
          {
            title: "Codice",
            value: data?.pricelist.id,
          },
          {
            title: "Azienda",
            value: data?.company.id,
          },
        ]}
      />

      <DefinitionListWidget
        title="Informazioni aggiuntive"
        values={[
          {
            title: "Mastrino",
            value: data?.currentInstance.accountingControl,
          },
          {
            title: "CDA",
            value: data?.currentInstance.cda,
          },
          {
            title: "Voce Vendita",
            value: data?.currentInstance.salesItem,
          },
        ]}
      />

      <GraphWidget
        title="Andamento Prezzi / Costi"
        dataset={data?.versions ?? []}
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
        versions={data?.versions}
        lastVersion={data?.latestVersion}
      />
    </div>
  );
};

export default SingleProductView;
function isAdmin() {
  throw new Error("Function not implemented.");
}
