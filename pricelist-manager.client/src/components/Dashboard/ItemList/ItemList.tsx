import { Link } from "react-router-dom";
import type { FetchData } from "../../../types";
import BasicLoader from "../../Loader/BasicLoader";

type Props<T extends any[]> = {
  title: string;
  fetch: FetchData<T>;
  color?: "blue" | "purple" | "yellow" | "green";
  Icon?: React.ComponentType<{ className?: string }>;
  getCallout?: (item: T[number]) => string;
  getline: (item: T[number]) => string;
  getUniqueId: (item: T[number]) => string;
  getRoute: (item: T[number]) => string;
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

function ItemList<T extends any[]>({
  title,
  fetch,
  color = "blue",
  getline,
  getCallout,
  getUniqueId,
  getRoute,
}: Props<T>) {
  return (
    <section className="flex-1 min-w-80 bg-gray-800 border-2 border-gray-700 rounded-md">
      <header className="p-4 flex justify-between gap-2 items-center">
        <h2 className={`text-xl font-medium ${headerVariant[color]}`}>
          {title}
        </h2>
        <Link className="text-blue-400 text-sm" to={"/"}>
          Vedi Tutte
        </Link>
      </header>
      <main className="px-4 pb-4">
        <ul className="flex flex-col">
          {fetch.isLoading ? (
            <BasicLoader color={color} />
          ) : fetch.errorMsg != undefined ? (
            <p className="text-red-500">{fetch.errorMsg}</p>
          ) : fetch.data && fetch.data.length > 0 ? (
            fetch.data.map((item: T[]) => (
              <li
                key={getUniqueId(item)}
                className="[&+li]:border-t-2 border-gray-700 py-2"
              >
                <Link
                  className="flex justify-between gap-2 py-1"
                  to={getRoute(item)}
                >
                  <p>{getline(item)}</p>
                  {getCallout !== undefined && (
                    <span className="uppercase text-xs bg-blue-100 text-blue-600 font-medium px-2 py-1 rounded-xl">
                      {getCallout(item)}
                    </span>
                  )}
                </Link>
              </li>
            ))
          ) : (
            <li className="py-2">
              <p>Non sono presenti elementi nel sistema, creane uno!</p>
            </li>
          )}
        </ul>
      </main>
    </section>
  );
}

export default ItemList;
