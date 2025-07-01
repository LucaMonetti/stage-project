import { FaCalendar } from "react-icons/fa6";
import type { ProductInstance } from "../../../models/ProductInstance";
import WidgetBase, { type QueryDimensions } from "./WidgetBase";

type Props = {
  dimensions?: QueryDimensions;
  versions?: ProductInstance[];
  lastVersion?: number;
};

const VersionWidget = ({ dimensions, versions = [], lastVersion }: Props) => {
  return (
    <WidgetBase
      dimensions={dimensions}
      className="flex flex-col justify-between gap-2 flex-wrap-reverse"
    >
      <h2 className="uppercase font-bold text-gray-500">Versioni</h2>
      <ul className="flex flex-col gap-4">
        {versions.map((version) => (
          <VersionItem
            key={version.version}
            version={version}
            currentVersion={lastVersion}
          />
        ))}
      </ul>
    </WidgetBase>
  );
};

const VersionItem = ({
  version,
  currentVersion = 0,
}: {
  version: ProductInstance;
  currentVersion?: number;
}) => {
  return (
    <li
      key={version.version}
      className={`bg-gray-800 rounded-md p-4 border-l-4 hover:bg-gray-700 transition-colors duration-200 ${
        version.version == currentVersion
          ? "border-l-green-500"
          : "border-l-gray-500"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              version.version == currentVersion ? "bg-green-500" : "bg-gray-500"
            }`}
          />
          <span className="text-white text-md uppercase font-semibold">
            Versione {version.version}
          </span>
        </div>

        <div className="text-gray-400 text-sm uppercase flex gap-2 items-center">
          <FaCalendar />
          <span>
            {version.updatedAt.toLocaleDateString("it-IT", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      <div className="text-gray-300 text-sm mb-3">{version.name}</div>

      <div className="flex gap-5 mb-2">
        <div className="text-sm">
          <span className="text-gray-400">Prezzo:</span>
          <span className="ml-1 text-green-400">{version.price}</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-400">Costo:</span>
          <span
            className={`ml-1 ${
              version.cost === 0 ? "text-red-400" : "text-red-400"
            }`}
          >
            {version.cost}
          </span>
        </div>
      </div>
    </li>
  );
};

export default VersionWidget;
