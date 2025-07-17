import { Link } from "react-router-dom";
import BasicLoader from "../../Loader/BasicLoader";

type Props<T extends any[]> = {
  title: string;
  data: T;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  color?: "blue" | "purple" | "yellow" | "green";
  Icon?: React.ComponentType<{ className?: string }>;
  getCallout?: (item: T[number]) => string;
  getline: (item: T[number]) => string;
  getUniqueId: (item: T[number]) => string;
  getRoute: (item: T[number]) => string;
  showAllLink?: string;
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
  data,
  isPending,
  isError,
  error,
  color = "blue",
  getline,
  getCallout,
  getUniqueId,
  getRoute,
  showAllLink,
}: Props<T>) {
  return (
    <section className="flex-1 min-w-80 bg-gray-800 border-2 border-gray-700 rounded-md">
      <header className="p-4 flex justify-between gap-2 items-center">
        <h2 className={`text-xl font-medium ${headerVariant[color]}`}>
          {title}
        </h2>
        {showAllLink && (
          <Link className="text-blue-400 text-sm" to={showAllLink}>
            Vedi Tutte
          </Link>
        )}
      </header>
      <main className="px-4 pb-4">
        <ul className="flex flex-col">
          {isPending ? (
            <BasicLoader color={color} />
          ) : isError ? (
            <p className="text-red-500">{error?.message}</p>
          ) : data && data.length > 0 ? (
            data.map((item: T[number]) => (
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
