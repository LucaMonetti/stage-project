import { useEffect, useState, type ChangeEventHandler } from "react";
import type {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { FaExclamation } from "react-icons/fa6";

type Props<T extends FieldValues> = {
  id: Path<T>;
  label: string;
  placeholder?: string;
  className?: string;
  isResizable?: boolean;
  isDisabled?: boolean;
  register: UseFormRegister<T>;
  registerOptions?: RegisterOptions<T, Path<T>>;
  error?: string;
  value?: string;
  onChange?: ChangeEventHandler;
};

function Textarea<T extends FieldValues>({
  id,
  label,
  placeholder,
  className,
  isResizable = false,
  register,
  registerOptions,
  error,
  isDisabled = false,
  value,
  onChange,
}: Props<T>) {
  const [data, setData] = useState("");

  useEffect(() => {
    if (value) setData(String(value));
  }, [value]);

  return (
    <>
      <div className="flex flex-col">
        <label htmlFor={id}>{label}</label>
        <textarea
          id={id}
          {...(isDisabled && { disabled: true })}
          className={`border-2 ${
            error !== undefined
              ? "border-red-400 hover:border-red-500 focus:border-red-500 focus-within:border-red-500"
              : "border-gray-700 hover:border-blue-500 focus:border-blue-500 focus-within:border-blue-500"
          } transition-colors outline-0 rounded px-4 py-2 bg-gray-900 ${className} ${
            !isResizable ? "resize-none" : ""
          }`}
          {...register(id, registerOptions)}
          value={data}
          onChange={(e) => {
            setData(e.target.value);

            if (onChange) {
              onChange(e);
            }
          }}
        >
          {placeholder?.trim()}
        </textarea>
      </div>
      {error !== undefined && (
        <div className="bg-opacity-10 border border-l-8 border-red-400 p-3 rounded-r-md">
          <div className="flex items-center gap-2">
            <FaExclamation className="text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        </div>
      )}
    </>
  );
}

export default Textarea;
