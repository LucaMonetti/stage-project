import type React from "react";
import WidgetBase, { type QueryDimensions } from "./WidgetBase";

type TableRow = {
  title: string;
  value?: React.ReactNode | string;
};

type Props = {
  title?: React.ReactNode;
  dimensions?: QueryDimensions;
  values: TableRow[];
};

const DefinitionListWidget = ({ title, dimensions, values }: Props) => {
  return (
    <WidgetBase dimensions={dimensions}>
      <h2 className="uppercase font-bold text-gray-500">{title}</h2>
      <dl className="grid grid-cols-[1fr] sm:grid-cols-[auto_1fr] [&>dd]:border-b-2 sm:[&>*]:border-b-2 [&>*]:border-gray-700 [&>dt]:pt-4 [&>dd]:pb-4 sm:[&>dt]:pt-2 sm:[&>dt]:pb-2 sm:[&>dd]:pt-2 sm:[&>dd]:pb-2 [&>*:nth-last-child(-n+2)]:border-b-0 [&>dt]:uppercase [&>dt]:font-medium [&>dt]:text-gray-500">
        {values.map((item, index) => (
          <ListItem key={index} item={item} />
        ))}
      </dl>
    </WidgetBase>
  );
};

const ListItem = ({ item }: { item: TableRow }) => {
  return (
    <>
      <dt>{item.title}:</dt>
      <dd className="pl-0 sm:pl-4">
        {item.value == "" ? <p className="text-gray-500">-</p> : item.value}
      </dd>
    </>
  );
};

export default DefinitionListWidget;
