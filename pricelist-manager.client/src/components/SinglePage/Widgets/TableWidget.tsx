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
};

function TableWidget<T extends Record<string, any>>({
  data,
  columns,
  config,
  keyField,
}: Props<T>) {
  return (
    <WidgetBase>
      <GenericTableView
        data={data}
        columns={columns}
        config={config}
        keyField={keyField}
      />
    </WidgetBase>
  );
}

export default TableWidget;
