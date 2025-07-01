import { useEffect, useState } from "react";
import type {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

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
}: Props<T>) {
  const [data, setData] = useState("");

  useEffect(() => {
    if (value) setData(String(value));
  }, [value]);

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        {...(isDisabled && { disabled: true })}
        className={`border-2 border-gray-700 rounded px-4 py-2 bg-gray-900 ${className} ${
          !isResizable ? "resize-none" : ""
        }`}
        {...register(id, registerOptions)}
        value={data}
        onChange={(e) => setData(e.target.value)}
      >
        {placeholder?.trim()}
      </textarea>
      {error !== undefined && (
        <div>
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </>
  );
}

export default Textarea;
