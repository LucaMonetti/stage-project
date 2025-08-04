import { useEffect, useState, type ChangeEventHandler } from "react";
import type {
  FieldValues,
  Path,
  UseFormRegister,
  RegisterOptions,
} from "react-hook-form";
import { FaExclamation } from "react-icons/fa6";

type Props<T extends FieldValues> = {
  id: Path<T>;
  className?: string;
  register: UseFormRegister<T>;
  registerOptions?: Partial<RegisterOptions<T>>;
  error?: string;
  value?: string | number;
  isDisabled?: boolean;
  onChange?: ChangeEventHandler;
  outerClass?: string;
  accept: string[];
};

function Input<T extends FieldValues>({
  id,
  register,
  registerOptions,
  error,
  value,
  isDisabled = false,
  onChange,
  outerClass,
  accept,
}: Props<T>) {
  const [data, setData] = useState("");

  useEffect(() => {
    if (value) setData(String(value));
  }, [value]);

  return (
    <div className={`flex flex-col gap-4 ${outerClass}`}>
      <div className="flex flex-col">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Carica File
        </label>
        <input
          id="csvFile"
          type="file"
          {...(isDisabled && { disabled: true })}
          {...register(id, registerOptions)}
          onChange={(e) => {
            setData(e.target.value);

            if (onChange) {
              onChange(e);
            }
          }}
          className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-purple-600 file:text-white hover:file:bg-purple-700 bg-gray-700 border border-gray-600 rounded-md"
          accept={accept.join(",")}
          multiple={false}
          value={data}
        />
      </div>
      {error !== undefined && (
        <div className="bg-opacity-10 border border-l-8 border-red-400 p-3 rounded-r-md">
          <div className="flex items-center gap-2">
            <FaExclamation className="text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Input;
