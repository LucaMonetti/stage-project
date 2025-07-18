import { useForm, type SubmitHandler } from "react-hook-form";
import { ProductCSVSchema, type ProductCSV } from "../../models/ProductCSV";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadProductsCsv } from "../../hooks/products/useMutationProduct";

const CsvForm = ({
  pricelistId,
  onSuccess,
}: {
  pricelistId: string;
  onSuccess?: (data: any) => void;
}) => {
  const methods = useForm({
    mode: "onSubmit",
    resolver: zodResolver(ProductCSVSchema),
  });

  const mutation = useUploadProductsCsv();

  const onSubmit: SubmitHandler<ProductCSV> = (data) => {
    console.log("Submitting CSV data:", data);

    mutation?.mutate(
      { pricelistId, csvFile: data.csvFile },
      {
        onSuccess: (data) => {
          if (onSuccess) {
            onSuccess(data);
          }
        },
      }
    );
  };

  // Add this to debug
  const onError = (errors: any) => {
    console.log("Form validation errors:", errors);
  };

  return (
    <form onSubmit={methods.handleSubmit(onSubmit, onError)}>
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-medium mb-4">Importa Prodotti</h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="csvFile"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Carica File
            </label>
            <input
              id="csvFile"
              type="file"
              {...methods.register("csvFile")}
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-purple-600 file:text-white hover:file:bg-purple-700 bg-gray-700 border border-gray-600 rounded-md"
              accept=".csv"
              multiple={false}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        Importa
      </button>
    </form>
  );
};

export default CsvForm;
