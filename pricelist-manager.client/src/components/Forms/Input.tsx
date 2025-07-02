import { useEffect, useState, type ChangeEventHandler } from "react";
import type {
  FieldValues,
  Path,
  UseFormRegister,
  RegisterOptions,
} from "react-hook-form";
import { FaExclamation } from "react-icons/fa6";

type Props<T extends FieldValues> = {
  type: React.HTMLInputTypeAttribute;
  id: Path<T>;
  label: string;
  placeholder?: string;
  className?: string;
  register: UseFormRegister<T>;
  registerOptions?: Partial<RegisterOptions<T>>;
  error?: string;
  value?: string | number;
  isDisabled?: boolean;
  onChange?: ChangeEventHandler;
  autocomplete?: boolean;
  outerClass?: string;
};

function Input<T extends FieldValues>({
  type,
  id,
  label,
  placeholder,
  className,
  register,
  registerOptions,
  error,
  value,
  isDisabled = false,
  onChange,
  autocomplete,
  outerClass,
}: Props<T>) {
  const [data, setData] = useState("");

  useEffect(() => {
    if (value) setData(String(value));
  }, [value]);

  return (
    <div className={`flex flex-col gap-4 ${outerClass}`}>
      <div className="flex flex-col">
        <label htmlFor={id}>{label}</label>
        <input
          type={type}
          {...(isDisabled && { disabled: true })}
          id={id}
          placeholder={placeholder}
          className={`border-2 ${
            error !== undefined
              ? "border-red-400 hover:border-red-500 focus:border-red-500 focus-within:border-red-500"
              : "border-gray-700 hover:border-blue-500 focus:border-blue-500 focus-within:border-blue-500"
          } transition-colors outline-0 rounded px-4 py-2 bg-gray-900 ${className}`}
          {...register(id, registerOptions)}
          value={data}
          onChange={(e) => {
            setData(e.target.value);

            if (onChange) {
              onChange(e);
            }
          }}
          autoComplete={autocomplete == true ? "on" : "off"}
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
