import type { FetchData } from "../../../types";
import BasicLoader from "../../Loader/BasicLoader";

import { FaBoxesStacked } from "react-icons/fa6";

type Props<T> = {
  title: string;
  fetch: FetchData<T>;
  description: string;
  color?: "blue" | "purple" | "yellow" | "green";
  Icon?: React.ComponentType<{ className?: string }>;
  getBodyText: (item?: T) => string | undefined;
};

const headerVariant = {
  blue: "text-blue-600",
  purple: "text-purple-600",
  yellow: "text-yellow-600",
  green: "text-green-600",
};

const bodyVariant = {
  blue: "text-blue-300",
  purple: "text-purple-300",
  yellow: "text-yellow-200",
  green: "text-green-300",
};

function ItemCounter<T>({
  title,
  fetch,
  description,
  color = "blue",
  Icon = FaBoxesStacked,
  getBodyText,
}: Props<T>) {
  return (
    <section className="flex-1 min-w-80 bg-gray-800 border-2 border-gray-700 rounded-md">
      <header className="p-4 flex gap-4 items-center text-xl">
        <Icon className={`${headerVariant[color]}`} />
        <h2 className="text-md font-medium">{title}</h2>
      </header>
      <main className="px-4 pb-4">
        {fetch.isLoading ? (
          <BasicLoader color={color} />
        ) : fetch.errorMsg != undefined ? (
          <p className="text-red-500">{fetch.errorMsg}</p>
        ) : (
          <p className={`text-4xl ${bodyVariant[color]} font-bold`}>
            {getBodyText(fetch.data)}
          </p>
        )}
        <p className="mt-2 text-gray-400">{description}</p>
      </main>
    </section>
  );
}

export default ItemCounter;
