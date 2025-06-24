import { useNavigate, useParams } from "react-router";
import { useFetch } from "../../../../hooks/useFetch";
import {
  ProductSchema,
  ProductWithVersionsSchema,
} from "../../../../models/Product";
import BasicLoader from "../../../../components/Loader/BasicLoader";
import SimpleIconButton from "../../../../components/Buttons/SimpleButton";
import { FaPencil, FaDownload } from "react-icons/fa6";
import { PricelistSchema } from "../../../../models/Pricelist";

const SingleProductView = () => {
  const { pricelistId, productCode } = useParams();
  const product = useFetch(
    `/api/pricelists/${pricelistId}/products/${productCode}/versions`,
    ProductWithVersionsSchema
  );

  const pricelist = useFetch(`/api/pricelists/${pricelistId}`, PricelistSchema);

  if (product.isLoading) {
    return (
      <div className="px-8 py-4 flex justify-center align-center h-full">
        <BasicLoader />
      </div>
    );
  }

  return (
    <div className="px-8 py-8 grid grid-cols-4 gap-4">
      <div className="p-4 rounded border-2 border-gray-700 col-start-1 col-end-5 flex justify-between gap-4 flex-wrap-reverse">
        <div>
          <h1 className="font-medium text-3xl">
            {product.data?.currentInstance.name}
          </h1>
          <p className="text-gray-400">
            {product.data?.currentInstance.description}
          </p>
          <p className="inline-block px-2 py-1 bg-blue-600 rounded text-sm mt-4">
            Versione {product.data?.latestVersion}
          </p>
        </div>
        <div className="flex gap-4 flex-wrap items-start">
          <SimpleIconButton
            Icon={FaPencil}
            color="purple"
            text="Modifica"
            route={`/admin-dashboard/edit/pricelists/${pricelistId}/products/${productCode}`}
            className="sm:flex-1"
          />
          <SimpleIconButton
            Icon={FaDownload}
            color="blue"
            text="Scarica"
            route={`/admin-dashboard`}
            className="sm:flex-1"
          />
        </div>
      </div>

      <div className="p-4 rounded border-2 border-gray-700 col-start-1 col-end-5 md:col-end-3">
        <h2 className="uppercase font-bold text-gray-500">Prezzo Corrente</h2>
        <p className="text-3xl text-green-500 font-medium">
          {product.data?.currentInstance.price.toFixed(2)} €
        </p>
      </div>
      <div className="p-4 rounded border-2 border-gray-700 col-start-1 col-end-5 md:col-start-3">
        <h2 className="uppercase font-bold text-gray-500">Costo Corrente</h2>
        <p className="text-3xl text-red-500 font-medium">
          {product.data?.currentInstance.price.toFixed(2)} €
        </p>
      </div>

      <div className="p-4 rounded border-2 border-gray-700 col-start-1 col-end-5 flex flex-col justify-between gap-2 flex-wrap-reverse">
        <h2 className="uppercase font-bold text-gray-500">Listino</h2>
        <dl className="grid grid-cols-[1fr] sm:grid-cols-[auto_1fr] [&>dd]:border-b-2 sm:[&>*]:border-b-2 [&>*]:border-gray-700 [&>dt]:pt-4 [&>dd]:pb-4 sm:[&>dt]:pt-2 sm:[&>dt]:pb-2 sm:[&>dd]:pt-2 sm:[&>dd]:pb-2 [&>*:nth-last-child(-n+2)]:border-b-0 [&>dt]:uppercase [&>dt]:font-medium [&>dt]:text-gray-500">
          <dt>Nome:</dt>
          <dd>{pricelist.data?.name}</dd>

          <dt>Codice:</dt>
          <dd>{pricelist.data?.id}</dd>

          <dt>Azienda:</dt>
          <dd>
            {pricelist.data?.company.id} - {pricelist.data?.company.name}
          </dd>
        </dl>
      </div>

      <div className="p-4 rounded border-2 border-gray-700 col-start-1 col-end-5 flex flex-col justify-between gap-2 flex-wrap-reverse">
        <h2 className="uppercase font-bold text-gray-500">Versioni</h2>
        <ul>
          {product.data?.versions.map((version) => (
            <li
              key={version.version}
              className={`relative border-l-4 rounded bg-gray-700 py-2 pl-10 pr-4 ${
                version.version == product.data?.latestVersion
                  ? "border-green-400"
                  : "border-gray-400"
              }`}
            >
              <span
                className={`block absolute w-4 h-4 rounded-full top-1/2 left-3 -translate-y-1/2 ${
                  version.version == product.data?.latestVersion
                    ? "bg-green-400"
                    : "bg-gray-400"
                }`}
              ></span>
              <h3 className="uppercase font-medium">
                Versione {version.version}
              </h3>
              <p className="text-sm">{version.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SingleProductView;
