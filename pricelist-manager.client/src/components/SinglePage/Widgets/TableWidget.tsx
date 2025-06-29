import type { FetchData } from "../../../types";
import GenericTableView, {
  type Column,
  type TableConfig,
} from "../../Dashboard/Tables/GenericTableView";
import WidgetBase from "./WidgetBase";

type Props<T> = {
  data: FetchData<T[]>;
  columns: Column<T>[];
  config?: TableConfig<T>;
  keyField: keyof T;
  title: string;
};

function TableWidget<T extends Record<string, any>>({
  data,
  columns,
  config,
  keyField,
  title,
}: Props<T>) {
  return (
    <WidgetBase>
      <h2 className="uppercase font-bold text-gray-500">{title}</h2>
      <GenericTableView
        data={data}
        columns={columns}
        config={config}
        keyField={keyField}
        className="mt-4"
      />
    </WidgetBase>
  );
}

export default TableWidget;
