import FormButton from "../../../components/Buttons/FormButton";
import ProductForm from "../../../components/Forms/ProductForm/ProductForm";

import { FaPlus } from "react-icons/fa6";

const CreateProductForm = () => {
  return (
    <div className="pb-4 px-8">
      <header className="flex justify-between items-center sticky top-[65.6px] bg-gray-900 z-50 py-4 border-gray-800 border-b-2">
        <div>
          <h1 className="text-3xl text-medium">Aggiungi un nuovo prodotto</h1>
          <p className="text-gray-400">
            Inserisci i dettagli del nuovo prodotto
          </p>
        </div>

        <FormButton formId="create-product-form" color="purple" Icon={FaPlus} />
      </header>

      <ProductForm className="mt-4" id="create-product-form" />
    </div>
  );
};

export default CreateProductForm;
