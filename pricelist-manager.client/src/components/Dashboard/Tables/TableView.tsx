import type { ProductLite } from "../../../models/Product";
import type { FetchData } from "../../../types";
import BasicLoader from "../../Loader/BasicLoader";

type Prods = {
  products: FetchData<ProductLite[]>;
};

const TableView = ({ products }: Prods) => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-full shadow-lg rounded-lg w-full overflow-x-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="min-w-full divide-y divide-gray-700 overflow-x-scroll">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Product Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Pricelist ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Versions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Company ID
                </th>
              </tr>
            </thead>

            {products.isLoading ? (
              <tbody>
                <tr>
                  <td colSpan={6} className="px-6 py-4">
                    <BasicLoader />
                  </td>
                </tr>
              </tbody>
            ) : products.data && products.data.length > 0 ? (
              <tbody className="bg-gray-900 divide-y divide-gray-700">
                {products.data.map((product, index) => (
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
};

export default TableView;
