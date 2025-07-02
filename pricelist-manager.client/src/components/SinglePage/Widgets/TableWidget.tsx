import type { FetchData } from "../../../types";
import type { Action } from "../../Buttons/ActionRenderer";
import ActionRenderer from "../../Buttons/ActionRenderer";
import GenericTableView, {
  type Column,
  type CustomColumnDef,
  type TableConfig,
} from "../../Dashboard/Tables/GenericTableView";
import WidgetBase from "./WidgetBase";

type Props<T> = {
  data: FetchData<T[]>;
  columns: CustomColumnDef<T>[];
  config?: TableConfig<T>;
  keyField: keyof T;
  title: string;
  actions?: Action[];
};

function TableWidget<T extends Record<string, any>>({
  data,
  columns,
  config,
  keyField,
  title,
  actions,
}: Props<T>) {
  return (
    <WidgetBase>
      <div className="flex justify-between items-center mb-4">
        <h2 className="uppercase font-bold text-gray-500">{title}</h2>
        {actions && (
          <div className="flex gap-4">
            <ActionRenderer actions={actions} />
          </div>
        )}
      </div>
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
