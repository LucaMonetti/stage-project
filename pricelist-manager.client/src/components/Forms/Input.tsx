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
  registerOptions?: RegisterOptions<T, Path<T>>;
  error?: string;
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
}: Props<T>) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className={`border-2 border-gray-700 rounded px-4 py-2 bg-gray-900 ${className}`}
        {...register(id, registerOptions)}
      />
      {error && (
        <div>
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}

export default Input;
