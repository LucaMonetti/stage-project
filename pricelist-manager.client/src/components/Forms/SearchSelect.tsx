import { FaExclamation } from "react-icons/fa6";
import type { FetchData } from "../../types";
import AsyncSelect from "react-select/async";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";
import { useCallback, useEffect, useState } from "react";

const customStyles = (hasError: boolean) => ({
  control: (base: any) => ({
    ...base,
    borderWidth: "2px",
    borderColor: hasError ? "#F87171" : "#374151", // Tailwind's gray-700
    borderRadius: "0.25rem", // rounded
    paddingLeft: "0.5rem", // px-4
    paddingTop: "0.2rem", // py-2
    paddingBottom: "0.2rem",
    backgroundColor: "#111827", // Tailwind's bg-gray-900
    boxShadow: "none",
    "&:hover": {
      borderColor: hasError ? "#EF4444" : "#3B82F6", // red-500 on hover when error
    },
    "&:focus-within": {
      borderColor: hasError ? "#EF4444" : "#3B82F6", // red-500 or blue-500 on focus
      boxShadow: hasError
        ? "0 0 0 3px rgba(248, 113, 113, 0.1)"
        : "0 0 0 3px rgba(59, 130, 246, 0.1)",
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
});

interface Option {
  value: string;
  label: string;
}

interface GroupedOptions {
  label: string;
  options: Option[];
}

type Props<T extends FieldValues, OptionItem> = {
  id: Path<T>;
  control: Control<T>;
  registerOptions?: RegisterOptions<T>;
  error?: string;
  value?: string;
  isDisabled?: boolean;
  label: string;
  placeholder?: string;
  fetchData: FetchData<OptionItem[]>;
  getLabel: (item: OptionItem) => string;
  getValue: (item: OptionItem) => string;
  groupBy?: (item: OptionItem) => { id: string; name: string }; // Optional grouping logic
};

function SearchSelect<T extends FieldValues, OptionItem>({
  id,
  control,
  fetchData,
  getLabel,
  getValue,
  groupBy,
  label,
  error,
  registerOptions,
  placeholder,
  value: prevValue,
  isDisabled = false,
}: Props<T, OptionItem>) {
  const [groupedOptions, setGroupedOptions] = useState<GroupedOptions[]>([]);

  useEffect(() => {
    if (!fetchData.data) {
      setGroupedOptions([]);
      return;
    }

    if (groupBy) {
      const groups: Record<string, GroupedOptions> = {};

      fetchData.data.forEach((item) => {
        const { id: groupId, name: groupName } = groupBy(item);

        if (!groups[groupId]) {
          groups[groupId] = {
            label: `${groupName} (${groupId})`,
            options: [],
          };
        }

        groups[groupId].options.push({
          label: getLabel(item),
          value: getValue(item),
        });
      });

      setGroupedOptions(Object.values(groups));
    } else {
      const flatOptions: GroupedOptions = {
        label: "",
        options: fetchData.data?.map((item) => ({
          label: getLabel(item),
          value: getValue(item),
        })),
      };

      setGroupedOptions([flatOptions]);
    }
  }, [fetchData.data]);

  return (
    <>
      <div className="flex flex-col">
        <label htmlFor={id}>{label}</label>
        <Controller
          control={control}
          name={id}
          rules={registerOptions}
          render={({
            field: { onChange, onBlur, value = prevValue, name, ref },
          }) => {
            const allOptions = groupedOptions.flatMap((g) => g.options);
            const selectedOption =
              allOptions.find((opt) => opt.value === value) ?? null;

            return (
              <AsyncSelect<Option, false>
                cacheOptions
                value={selectedOption}
                loadOptions={(input) => {
                  const filtered = groupedOptions
                    .map((group) => ({
                      ...group,
                      options: group.options.filter((opt) =>
                        opt.label.toLowerCase().includes(input.toLowerCase())
                      ),
                    }))
                    .filter((group) => group.options.length > 0);

                  return Promise.resolve(filtered);
                }}
                onChange={(selected) => {
                  onChange(selected?.value ?? "");
                }}
                onBlur={onBlur}
                name={name}
                ref={ref}
                classNames={{
                  option: () => "custom-select-option",
                }}
                defaultOptions={groupedOptions}
                placeholder={
                  fetchData.isLoading
                    ? "Ricerca in corso.."
                    : placeholder ?? "Seleziona un'opzione"
                }
                styles={customStyles(!!error)}
                isOptionDisabled={(opt) => isDisabled && opt.value != value}
              />
            );
          }}
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
    </>
  );
}

export default SearchSelect;
