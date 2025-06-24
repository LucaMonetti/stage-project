import { Link, useNavigate } from "react-router";
import type { FetchData } from "../../../types";
import BasicLoader from "../../Loader/BasicLoader";
import type { MouseEventHandler } from "react";

type Prods<T> = {
  data: FetchData<T[]>;
  columns: Column<T>[];
  keyField: keyof T;
  className?: string;
  config?: TableConfig<T>;
};

export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  headerClassName?: string;
  className?: string;
  mobileLabel?: string;
  hideOnMobile?: boolean;
}

export interface TableConfig<T> {
  enableLink: boolean;
  baseUrl: string;
  columnId: Record<string, keyof T>;
}

function GenericTableView<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  className,
  config = {
    enableLink: true,
    baseUrl: "",
    columnId: {},
  },
}: Prods<T>) {
  const navigate = useNavigate();

  const renderCellValue = (column: Column<T>, row: T): React.ReactNode => {
    let value = getValue(column.key as string, row);
    return column.render ? column.render(value, row) : String(value ?? "");
  };

  const getValue = (key: keyof T, row: T) => {
    let keys: (keyof T)[] = (key as string).split(".");
    let value = row;

    keys.forEach((key) => {
      value = value[key];
    });

    return value;
  };

  const handleClickRow = (e: React.MouseEvent, row: T) => {
    e.preventDefault();

    let endpoint = config.baseUrl;

    for (const [columnKey, propertyKey] of Object.entries(config.columnId)) {
      endpoint = endpoint.replace(
        columnKey,
        String(getValue(propertyKey, row))
      );
    }

    navigate(endpoint);
  };

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <div className="min-w-full shadow-lg rounded-lg w-full overflow-x-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="min-w-full divide-y divide-gray-700 overflow-x-scroll">
            <thead className="bg-gray-800">
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      column.headerClassName || ""
                    }`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>

            {data.isLoading ? (
              <tbody>
                <tr>
                  <td colSpan={columns.length} className="px-6 py-4">
                    <BasicLoader />
                  </td>
                </tr>
              </tbody>
            ) : data.data && data.data.length > 0 ? (
              <tbody className="bg-gray-900 divide-y divide-gray-700">
                {data.data.map((row, index) => (
                  <tr
                    onClick={
                      config.enableLink
                        ? (
                            e: React.MouseEvent<HTMLTableRowElement, MouseEvent>
                          ) => {
                            handleClickRow(e, row);
                          }
                        : undefined
                    }
                    key={String(row[keyField])}
                    className={`${
                      index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                    } hover:bg-blue-950`}
                  >
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={`px-6 py-4 text-sm ${
                          column.className || "text-white"
                        }`}
                      >
                        {renderCellValue(column, row)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-sm text-gray-500">
                    Non sono stati registrati prodotti all'interno del database!
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

export default GenericTableView;
