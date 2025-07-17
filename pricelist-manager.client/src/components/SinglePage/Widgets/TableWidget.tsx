import type { PaginationInfo } from "../../../models/Pagination";
import type { Action } from "../../Buttons/ActionRenderer";
import ActionRenderer from "../../Buttons/ActionRenderer";
import GenericTableView, {
  type CustomColumnDef,
  type TableConfig,
} from "../../Dashboard/Tables/GenericTableView";
import WidgetBase from "./WidgetBase";

type Props<T> = {
  data: T[];
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  columns: CustomColumnDef<T>[];
  config?: TableConfig<T>;
  keyField: keyof T;
  title: string;
  actions?: Action[];

  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
};

function TableWidget<T extends Record<string, any>>({
  data,
  isPending,
  isError,
  error,
  columns,
  config,
  keyField,
  title,
  actions,
  pagination,
  onPageChange,
  onPageSizeChange,
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
        isPending={isPending}
        isError={isError}
        error={error}
        columns={columns}
        config={config}
        keyField={keyField}
        className="mt-4"
        pagination={pagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </WidgetBase>
  );
}

export default TableWidget;
