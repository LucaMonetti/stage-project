import { useNavigate } from "react-router";
import BasicLoader from "../../Loader/BasicLoader";
import { useEffect, useState } from "react";
import type { FieldValues, Path } from "react-hook-form";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFilter,
  type Table,
} from "@tanstack/react-table";
import FilterRenderer from "./FilterRenderer";
import type { Config } from "../../Forms/GenericForm";
import type { PaginationInfo } from "../../../hooks/products/useQueryProducts";

export type CustomColumnDef<T> = ColumnDef<T> & {
  linkUrl?: (item: T) => string;
};

type Prods<T extends Record<string, any>, TFilter extends FieldValues> = {
  data: T[];
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  columns: CustomColumnDef<T>[];
  keyField: keyof T;
  className?: string;
  config?: TableConfig<T>;
  filterConfig?: Config<TFilter>;
  onTableReady?: (item: Table<T>) => void;

  selectedItems?: T[];
  enableCheckbox?: boolean;
  onRowSelect?: (item: T) => void;

  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
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

const PaginationControls = ({
  pagination,
  onPageChange,
  onPageSizeChange,
}: {
  pagination: PaginationInfo;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}) => {
  const {
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    hasNext,
    hasPrevious,
  } = pagination;

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-gray-800 border-t border-gray-700">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-400">Mostra</span>
        <select
          value={pageSize}
          onChange={(e) =>
            onPageSizeChange && onPageSizeChange(Number(e.target.value))
          }
          className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-sm text-gray-400">di {totalCount} risultati</span>
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange && onPageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm bg-gray-700 border border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
        >
          ««
        </button>
        <button
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm bg-gray-700 border border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
        >
          ‹
        </button>

        <span className="px-3 py-1 text-sm">
          Pagina {currentPage} di {totalPages}
        </span>

        <button
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm bg-gray-700 border border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
        >
          ›
        </button>
        <button
          onClick={() => onPageChange && onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm bg-gray-700 border border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
        >
          »»
        </button>
      </div>
    </div>
  );
};

function GenericTableView<
  T extends Record<string, any>,
  TFilter extends FieldValues
>({
  data,
  isPending,
  columns,
  keyField,
  className,
  config = {
    enableLink: true,
    baseUrl: "",
    columnId: {},
  },
  filterConfig,
  onTableReady,
  selectedItems,
  enableCheckbox = false,
  onRowSelect,
  pagination,
  onPageChange,
  onPageSizeChange,
}: Prods<T, TFilter>) {
  const navigate = useNavigate();

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRowSelect = (item: T) => {
    if (onRowSelect) {
      onRowSelect(item);
    }
  };

  const isRowSelected = (item: T) => {
    if (!selectedItems) return false;
    return selectedItems.some(
      (selectedItem) => selectedItem[keyField] === item[keyField]
    );
  };

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

  useEffect(() => {
    if (onTableReady) {
      onTableReady(table);
    }
  }, [table, onTableReady]);

  return (
    <div className={className}>
      {filterConfig && <FilterRenderer config={filterConfig} />}

      {enableCheckbox && (
        <div className="bg-gray-800 rounded p-4 border-2 border-gray-700 my-4">
          <p className="text-sm">
            {selectedItems?.length ?? 0} Prodott
            {selectedItems?.length !== 1 ? "i" : "o"}
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-800">
                {enableCheckbox && (
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded"
                      onChange={() => {
                        if (!data) return;
                        const allSelected =
                          selectedItems &&
                          data.every((item) =>
                            selectedItems.some(
                              (selected) =>
                                selected[keyField] === item[keyField]
                            )
                          );
                        if (allSelected) {
                          // Deselect all
                          data.forEach((item) => {
                            if (isRowSelected(item)) {
                              onRowSelect && onRowSelect(item);
                            }
                          });
                        } else {
                          // Select all
                          data.forEach((item) => {
                            if (!isRowSelected(item)) {
                              onRowSelect && onRowSelect(item);
                            }
                          });
                        }
                      }}
                    />
                  </th>
                )}
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
          {isPending ? (
            <tbody>
              <tr>
                <td
                  colSpan={columns.length + (enableCheckbox ? 1 : 0)}
                  className="px-6 py-4"
                >
                  <BasicLoader />
                </td>
              </tr>
            </tbody>
          ) : data && data.length > 0 ? (
            <tbody className="bg-gray-900 divide-y divide-gray-700">
              {table.getRowModel().rows.map((row, rowIndex) => {
                const rowData = data ? data[rowIndex] : undefined;
                return (
                  <tr
                    onClick={
                      config.enableLink
                        ? (
                            e: React.MouseEvent<HTMLTableRowElement, MouseEvent>
                          ) => {
                            // Don't navigate if clicking on checkbox
                            if (
                              (e.target as HTMLElement).closest(
                                'input[type="checkbox"]'
                              )
                            ) {
                              return;
                            }
                            handleClickRow(e, rowData);
                          }
                        : undefined
                    }
                    key={row.id}
                    className="hover:bg-gray-700"
                  >
                    {enableCheckbox && rowData && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={isRowSelected(rowData)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleRowSelect(rowData);
                          }}
                        />
                      </td>
                    )}
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
                                handleCellClick(e, columns[colIndex], rowData);
                              }
                            : undefined
                        }
                        key={cell.id}
                        className={`px-6 py-4 ${
                          cell.column.columnDef.meta
                            ? (
                                cell.column.columnDef.meta as {
                                  className?: string;
                                }
                              ).className ?? ""
                            : ""
                        } ${columns[colIndex].linkUrl ? "cursor-pointer" : ""}`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td
                  colSpan={columns.length + (enableCheckbox ? 1 : 0)}
                  className="px-6 py-4 text-sm text-gray-500"
                >
                  Non sono stati registrati prodotti all'interno del database!
                </td>
              </tr>
            </tbody>
          )}
        </table>

        {pagination && (
          <PaginationControls
            pagination={pagination}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        )}
      </div>
    </div>
  );
}

export default GenericTableView;
