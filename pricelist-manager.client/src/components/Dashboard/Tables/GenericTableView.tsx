import type { Product } from "../../../models/Product";
import type { FetchData } from "../../../types";
import BasicLoader from "../../Loader/BasicLoader";

type Prods<T> = {
  data: FetchData<T[]>;
  columns: Column<T>[];
  keyField: keyof T;
  className?: string;
};

export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
  mobileLabel?: string;
  hideOnMobile?: boolean;
}

function GenericTableView<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  className,
}: Prods<T>) {
  const renderCellValue = (column: Column<T>, row: T) => {
    const value = row[column.key];
    return column.render ? column.render(value, row) : value;
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
                      column.className || ""
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
                    key={String(row[keyField])}
                    className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
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

                {data.data.map((product, index) => (
                  <tr
                    key={product.productCode}
                    className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {product.productCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {product.pricelistId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {product.currentInstance.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-white max-w-xs truncate">
                      {product.currentInstance.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-white max-w-xs truncate">
                      {product.totalVersions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-semibold">
                      {product.currentInstance.price.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                      {product.companyId}
                    </td>
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

        {/* Mobile Cards */}
        <div className="md:hidden">
          {products.isLoading ? (
            <div className="px-6 py-4">
              <BasicLoader />
            </div>
          ) : products.data && products.data.length > 0 ? (
            <>
              {products.data.map((product) => (
                <div
                  key={product.productCode}
                  className="bg-gray-900 border-b border-gray-700 p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-white">
                      {product.currentInstance.name}
                    </h3>
                    <span className="text-lg font-semibold text-green-600">
                      ${product.currentInstance.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Product Code:
                      </span>
                      <span className="text-sm text-white">
                        {product.productCode}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Pricelist ID:
                      </span>
                      <span className="text-sm text-white">
                        {product.pricelistId}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Company ID:
                      </span>
                      <span className="text-sm text-white">
                        {product.companyId}
                      </span>
                    </div>

                    <div className="mt-2">
                      <span className="text-sm font-medium text-gray-500">
                        Description:
                      </span>
                      <p className="text-sm text-white mt-1">
                        {product.currentInstance.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <p className="px-6 py-4 text-sm text-gray-500">
              Non sono stati registrati prodotti all'interno del database!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default GenericTableView;
