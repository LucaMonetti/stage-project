import WidgetBase, { type QueryDimensions } from "./WidgetBase";

type Props = {
  title: React.ReactNode;
  amount?: number;
  color?: "green" | "red";
  currency?: string;
  dimensions?: QueryDimensions;
};

const MoneyWidget = ({
  title,
  amount = 0,
  color = "green",
  currency = "€",
  dimensions = { default: { startCol: 1, endCol: 5 }, md: { endCol: 3 } },
}: Props) => {
  return (
    <WidgetBase dimensions={dimensions} className="">
      {title && <h2 className="uppercase font-bold text-gray-500">{title}</h2>}
      <p
        className={`text-3xl ${
          color == "green" ? "text-green-500" : "text-red-500"
        } font-medium`}
      >
        {`${amount.toFixed(2)} ${currency}`}
      </p>
    </WidgetBase>
  );
};

export default MoneyWidget;
