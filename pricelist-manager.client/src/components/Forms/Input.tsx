import { useEffect, useState } from "react";
import type {
  FieldValues,
  Path,
  UseFormRegister,
  RegisterOptions,
} from "react-hook-form";

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
}: Props<T>) {
  const [data, setData] = useState("");

  useEffect(() => {
    if (value) setData(String(value));
  }, [value]);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        {...(isDisabled && { disabled: true })}
        id={id}
        placeholder={placeholder}
        className={`border-2 border-gray-700 rounded px-4 py-2 bg-gray-900 ${className}`}
        {...register(id, registerOptions)}
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
      {error !== undefined && (
        <div>
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}

export default Input;
