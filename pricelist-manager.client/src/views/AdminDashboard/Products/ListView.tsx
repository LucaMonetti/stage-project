import { FaPlus } from "react-icons/fa6";
import ActionRenderer from "../../../components/Buttons/ActionRenderer";
import GenericTableView, {
  type CustomColumnDef,
} from "../../../components/Dashboard/Tables/GenericTableView";
import { useFetch } from "../../../hooks/useFetch";
import {
  ProductArraySchema,
  type Product,
  type ProductFilter,
} from "../../../models/Product";
import { type ColumnDef, type Table } from "@tanstack/react-table";
import type { Config } from "../../../components/Forms/GenericForm";
import { CompanyArraySchema } from "../../../models/Company";
import { useGet } from "../../../hooks/useGenericFetch";
import { useRef, useState } from "react";

const ProductsListView = () => {
  const products = useFetch("products", ProductArraySchema);
  const [table, setTable] = useState<Table<Product>>();

  const columns: CustomColumnDef<Product>[] = [
    {
      accessorKey: "companyId",
      header: "Azienda",
      meta: {
        mobileLabel: "Azienda",
        className: "text-gray-500",
      },
    },
    {
      accessorKey: "pricelist.name",
      header: "Listino",
      meta: {
        mobileLabel: "Pricelist",
        className: "text-gray-500",
      },
    },
    {
      accessorKey: "productCode",
      header: "Codice Prodotto",
      meta: {
        mobileLabel: "Code",
      },
    },
    {
      accessorKey: "currentInstance.name",
      header: "Nome",
    },
    {
      accessorKey: "currentInstance.description",
      header: "Descrizione",
      meta: {
        className: "max-w-xs truncate",
      },
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return (
          <span className="block truncate" title={value}>
            {value}
          </span>
        );
      },
    },
    {
      accessorKey: "currentInstance.price",
      header: "Prezzo",
      meta: {
        className: "font-medium text-green-600 whitespace-nowrap",
      },
      accessorFn: (row: Product) => `${row.currentInstance.price.toFixed(2)} €`,
    },
    {
      accessorKey: "currentInstance.cost",
      header: "Costo",
      meta: {
        className: "font-medium text-red-600 whitespace-nowrap",
      },
      accessorFn: (row: Product) => `${row.currentInstance.cost.toFixed(2)} €`,
    },
  ];

  const filterConfig = {
    fieldset: [
      {
        title: "Filtri",
        inputs: [
          {
            id: "productCode",
            label: "Codice Prodotto",
            type: "text",
            placeholder: "Inserire il codice del prodotto",
            autocomplete: false,
            outerClass: "flex-1",
            onChange: (e) => {
              table?.getColumn("productCode")?.setFilterValue(e.target.value);
            },
          },
          {
            id: "companyId",
            label: "Codice Azienda",
            type: "searchable",
            placeholder: "Selezionare codice azienda...",
            fetchData: useGet({
              endpoint: "companies",
              method: "GET",
              schema: CompanyArraySchema,
            }),
            schema: "company",
            onChange: (value) => {
              console.log("I'm changing!");
              table?.getColumn("companyId")?.setFilterValue(value);
            },
          },
        ],
      },
    ],
    endpoint: "products",
  } satisfies Config<ProductFilter>;

  return (
    <div className="px-8 py-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl text-medium">Prodotti</h1>
          <p className="text-gray-400">
            Visualizza tutti i prodotti registrati all'interno della
            piattaforma.
          </p>
        </div>
        <ActionRenderer
          actions={[
            {
              color: "blue",
              Icon: FaPlus,
              route: `/admin-dashboard/create/products`,
            },
          ]}
        />
      </div>

      <GenericTableView<Product, ProductFilter>
        data={products}
        columns={columns}
        config={{
          baseUrl: "/admin-dashboard/products/:pid",
          enableLink: true,
          columnId: { ":pid": "id" },
        }}
        onTableReady={setTable}
        filterConfig={filterConfig}
        keyField="productCode"
      />
    </div>
  );
};

export default ProductsListView;
