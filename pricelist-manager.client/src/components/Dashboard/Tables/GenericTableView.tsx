import { Link, useNavigate } from "react-router";
import type { FetchData } from "../../../types";
import BasicLoader from "../../Loader/BasicLoader";
import type { MouseEventHandler } from "react";
import type { Path } from "react-hook-form";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

export type CustomColumnDef<T> = ColumnDef<T> & {
  linkUrl?: (item: T) => string;
};

type Prods<T> = {
  data: FetchData<T[]>;
  columns: CustomColumnDef<T>[];
  keyField: keyof T;
  className?: string;
  config?: TableConfig<T>;
};

export interface Column<T> {
  key: Path<T>;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  headerClassName?: string;
  className?: string;
  mobileLabel?: string;
  hideOnMobile?: boolean;
  linkUrl?: (item: T) => string;
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
  const table = useReactTable({
    data: data.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const getValue = (key: keyof T, row: T) => {
    let keys: (keyof T)[] = (key as string).split(".");
    let value = row;

    keys.forEach((key) => {
      value = value[key];
    });

    return value;
  };

  const handleClickRow = (e: React.MouseEvent, row?: T) => {
    if (!row) return;

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

  const handleCellClick = (
    e: React.MouseEvent,
    column: CustomColumnDef<T>,
    row?: T
  ) => {
    if (!column.linkUrl || !row) return;

    e.preventDefault();
    e.stopPropagation();

    const url = column.linkUrl(row);

    if (url.startsWith("mailto:") || url.startsWith("tel:")) {
      window.location.href = url;
    } else {
      navigate(url);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-800">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
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
            {table.getRowModel().rows.map((row, rowIndex) => (
              <tr
                onClick={
                  config.enableLink
                    ? (
                        e: React.MouseEvent<HTMLTableRowElement, MouseEvent>
                      ) => {
                        handleClickRow(
                          e,
                          data.data ? data.data[rowIndex] : undefined
                        );
                      }
                    : undefined
                }
                key={row.id}
                className="hover:bg-gray-700"
              >
                {row.getVisibleCells().map((cell, colIndex) => (
                  <td
                    onClick={
                      columns[colIndex].linkUrl
                        ? (
                            e: React.MouseEvent<
                              HTMLTableCellElement,
                              MouseEvent
                            >
                          ) => {
                            console.log(rowIndex);
                            handleCellClick(
                              e,
                              columns[colIndex],
                              data.data ? data.data[rowIndex] : undefined
                            );
                          }
                        : undefined
                    }
                    key={cell.id}
                    className={`px-6 py-4 ${
                      cell.column.columnDef.meta
                        ? (cell.column.columnDef.meta as { className?: string })
                            .className ?? ""
                        : ""
                    } ${columns[colIndex].linkUrl ? "cursor-pointer" : ""}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
  );
}

export default GenericTableView;
