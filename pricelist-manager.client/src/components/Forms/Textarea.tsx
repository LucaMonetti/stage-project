import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

type Props<T extends FieldValues> = {
  id: Path<T>;
  label: string;
  placeholder?: string;
  className?: string;
  isResizable?: boolean;
  register: UseFormRegister<T>;
};

function Textarea<T extends FieldValues>({
  id,
  label,
  placeholder,
  className,
  isResizable = false,
  register,
}: Props<T>) {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        className={`border-2 border-gray-700 rounded px-4 py-2 bg-gray-900 ${className} ${
          !isResizable ? "resize-none" : ""
        }`}
        {...register(id)}
      >
        {placeholder?.trim()}
      </textarea>
    </>
  );
}

export default Textarea;
