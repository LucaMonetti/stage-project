import AsyncSelect from "react-select/async";
import { useFetch } from "../../hooks/useFetch";
import { PricelistArraySchema } from "../../models/Pricelist";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

// Tailwind-inspired custom styles for react-select
const customStyles = {
  control: (base: any) => ({
    ...base,
    borderWidth: "2px",
    borderColor: "#374151", // Tailwind's gray-700
    borderRadius: "0.25rem", // rounded
    paddingLeft: "0.5rem", // px-4
    paddingTop: "0.2rem", // py-2
    paddingBottom: "0.2rem",
    backgroundColor: "#111827", // Tailwind's bg-gray-900
    boxShadow: "none",
    "&:hover": {
      borderColor: "#4B5563", // Tailwind's gray-600 on hover
    },
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: "#111827", // Tailwind's bg-gray-900
    color: "#F9FAFB", // text-white
    borderRadius: "0.5rem",
    borderColor: "#374151", // Tailwind's gray-700
    marginTop: "4px",
    paddingLeft: "4px",
    paddingRight: "4px",
  }),
  option: (base: any, state: { isFocused: any }) => ({
    ...base,
    backgroundColor: state.isFocused ? "#374151" : "#1F2937", // hover and default
    color: "#F9FAFB",
    cursor: "pointer",
    padding: "0.5rem 1rem",
    borderRadius: "0.3rem",
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "#F9FAFB",
  }),
  input: (base: any) => ({
    ...base,
    color: "#F9FAFB",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "#9CA3AF", // Tailwind's gray-400
  }),
};

type Props<T extends FieldValues> = {
  id: Path<T>;
  control: Control<T, any, T>;
};

type Option = {
  label: string;
  value: string;
};

function SearchableSelect<T extends FieldValues>({ id, control }: Props<T>) {
  const pricelists = useFetch("/api/pricelists", PricelistArraySchema);
  const options =
    pricelists.data?.map((i) => ({
      label: `${i.company.id} - ${i.name}`,
      value: i.id,
    })) || [];

  const search = (searchStr: string) => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchStr.toLowerCase())
    );
  };

  const loadOptions = (
    searchStr: string,
    callback: (options: Option[]) => void
  ) => {
    callback(search(searchStr));
  };

  return (
    <Controller
      control={control}
      name={id}
      render={({ field: { onChange, onBlur, value, name, ref } }) => (
        <AsyncSelect<Option, false>
          cacheOptions
          loadOptions={loadOptions}
          onChange={(selected) => onChange(selected?.value ?? "")}
          onBlur={onBlur}
          value={options.find((opt) => opt.value === value) || null}
          name={name}
          ref={ref}
          classNames={{
            option: () => "custom-select-option",
          }}
          defaultOptions
          placeholder="Ricerca in corso"
          styles={customStyles}
        />
      )}
    />
  );
}

export default SearchableSelect;
