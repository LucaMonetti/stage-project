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
      className={`relative border-l-4 rounded bg-gray-700 py-2 pl-10 pr-4 ${
        version.version == currentVersion
          ? "border-green-400"
          : "border-gray-400"
      }`}
    >
      <span
        className={`block absolute w-4 h-4 rounded-full top-1/2 left-3 -translate-y-1/2 ${
          version.version == currentVersion ? "bg-green-400" : "bg-gray-400"
        }`}
      ></span>
      <h3 className="uppercase font-medium">Versione {version.version}</h3>
      <p className="text-sm">{version.name}</p>
    </li>
  );
};

export default VersionWidget;
