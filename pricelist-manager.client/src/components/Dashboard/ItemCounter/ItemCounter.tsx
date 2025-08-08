import SimpleIconButton from "../../Buttons/SimpleButton";
import BasicLoader from "../../Loader/BasicLoader";

import { FaBoxesStacked } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";

type Props<T> = {
  title: string;
  data: T;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  description: string;
  color?: "blue" | "purple" | "yellow" | "green";
  Icon?: React.ComponentType<{ className?: string }>;
  getBodyText: (item?: T) => string | undefined;
  createLink: string;
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
  data,
  isPending,
  isError,
  error,
  description,
  color = "blue",
  Icon = FaBoxesStacked,
  getBodyText,
  createLink,
}: Props<T>) {
  return (
    <section className="flex-1 min-w-80 bg-gray-800 border-2 border-gray-700 rounded-md">
      <header className="p-4 flex items-center justify-between text-xl">
        <div className="flex gap-4 items-center">
          <Icon className={`${headerVariant[color]}`} />
          <h2 className="text-md font-medium">{title}</h2>
        </div>
        <SimpleIconButton
          route={createLink}
          Icon={FaPlus}
          color={color}
          className="text-sm"
        />
      </header>
      <main className="px-4 pb-4">
        {isPending ? (
          <BasicLoader color={color} />
        ) : isError ? (
          <p className="text-red-500">{error?.message}</p>
        ) : (
          <p className={`text-4xl ${bodyVariant[color]} font-bold`}>
            {getBodyText(data)}
          </p>
        )}
        <p className="mt-2 text-gray-400">{description}</p>
      </main>
    </section>
  );
}

export default ItemCounter;
