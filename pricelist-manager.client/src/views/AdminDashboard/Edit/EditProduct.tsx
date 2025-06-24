import { useParams } from "react-router";
import FormButton from "../../../components/Buttons/FormButton";
import ProductForm, {
  type ProductFormData,
} from "../../../components/Forms/ProductForm/ProductForm";

import { FaPlus } from "react-icons/fa6";
import { useFetch } from "../../../hooks/useFetch";
import { ProductWithVersionsSchema } from "../../../models/Product";

const EditProductForm = () => {
  const { pricelistId, productCode } = useParams();
  const product = useFetch(
    `/api/pricelists/${pricelistId}/products/${productCode}/versions`,
    ProductWithVersionsSchema
  );

  let edit;

  if (product.data) {
    edit = {
      name: product.data.currentInstance.name,
      description: product.data.currentInstance.description,
      price: product.data.currentInstance.price,
      pricelistId: product.data.pricelistId,
      productCode: product.data.productCode,
    } satisfies ProductFormData;
  }

  return (
    <div className="pb-4 px-8">
      <header className="flex justify-between items-center sticky top-[65.6px] bg-gray-900 z-50 py-4 border-gray-800 border-b-2">
        <div>
          <h1 className="text-3xl text-medium">Modifica il prodotto</h1>
          <p className="text-gray-400">
            Inserisci i dettagli del nuovo prodotto
          </p>
        </div>

        <FormButton
          formId="create-product-form"
          color="purple"
          text="Aggiorna"
          Icon={FaPlus}
          disabled={product.isLoading}
        />
      </header>

      <ProductForm className="mt-4" id="create-product-form" values={edit} />
    </div>
  );
};

export default EditProductForm;
