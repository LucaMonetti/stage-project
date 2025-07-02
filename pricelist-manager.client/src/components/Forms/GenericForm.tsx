import { useEffect, useRef, useState, type ChangeEventHandler } from "react";
import Fieldset from "./Fieldset";
import Input from "./Input";
import Textarea from "./Textarea";
import {
  useForm,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
  type RegisterOptions,
  type SubmitHandler,
  type UseFormRegister,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGet, usePost } from "../../hooks/useGenericFetch";
import { FaExclamation } from "react-icons/fa6";
import SearchSelect from "./SearchSelect";
import { PricelistArraySchema, type Pricelist } from "../../models/Pricelist";
import type { z, ZodType } from "zod/v4";
import type { FetchData } from "../../types";
import type { Company } from "../../models/Company";
import type { Product } from "../../models/Product";

type InferredZodSchema<T extends FieldValues> = z.ZodType<T, any, any>;

interface Props<T extends FieldValues> {
  className?: string;
  schema: InferredZodSchema<T>;
  config: Config<T>;
  values?: T;
  method?: "POST" | "PUT" | "DELETE";
  id: string;
  isRow?: boolean;
}

interface BaseInput<T extends FieldValues> {
  id: Path<T>;
  label: string;
  registerOptions?: Partial<RegisterOptions<T>>;
  placeholder?: string;
  isDisabled?: boolean;
  autocomplete?: boolean;
  outerClass?: string;
}

interface NumberInput<T extends FieldValues> extends BaseInput<T> {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

interface SimpleInput<T extends FieldValues> extends BaseInput<T> {
  type: "text" | "email" | "password" | "url" | "color";
  maxLength?: number;
  onChange?: ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >;
}

interface TextAreaInput<T extends FieldValues> extends BaseInput<T> {
  type: "textarea";
  maxLength?: number;
}

interface SearchableInput<T extends FieldValues> extends BaseInput<T> {
  type: "searchable";
  maxLength?: number;
  schema: "pricelist" | "product" | "company";
  fetchData: FetchData<Pricelist[] | Product[] | Company[]>;
  onChange?: (value: string) => void;
}

type InputConfig<T extends FieldValues> =
  | SimpleInput<T>
  | NumberInput<T>
  | SearchableInput<T>
  | TextAreaInput<T>;

interface FieldSet<T extends FieldValues> {
  title: string;
  inputs: InputConfig<T>[];
}

export interface Config<T extends FieldValues> {
  fieldset: FieldSet<T>[];
  endpoint: string;
}

function RenderInputField<T extends FieldValues>(
  input: InputConfig<T>,
  register: UseFormRegister<T>,
  control: Control<T, any, T>,
  errors: FieldErrors<T>,
  values: T | undefined,
  key: string
) {
  const commonProps = {
    id: input.id,
    placeholder: input.placeholder,
    register: register,
    registerOptions: input.registerOptions,
    label: input.label,
    error: errors[input.id]?.message?.toString() ?? undefined,
    value: values ? values[input.id] : undefined,
    outerClass: input.outerClass ?? "",
  };

  switch (input.type) {
    case "text":
    case "email":
    case "password":
    case "url":
      return (
        <Input
          key={key}
          isDisabled={input.isDisabled}
          {...commonProps}
          autocomplete={input.autocomplete ?? false}
          onChange={input.onChange ?? undefined}
          type={input.type}
        />
      );
    case "number":
      return (
        <Input
          key={key}
          isDisabled={input.isDisabled}
          {...commonProps}
          autocomplete={input.autocomplete ?? false}
          type={input.type}
        />
      );
    case "color":
      return (
        <Input
          key={key}
          isDisabled={input.isDisabled}
          autocomplete={input.autocomplete ?? false}
          {...commonProps}
          type={input.type}
          className="min-h-12 w-full"
        />
      );
    case "searchable":
      switch (input.schema) {
        case "pricelist":
          return (
            <SearchSelect<T, Pricelist>
              key={key}
              isDisabled={input.isDisabled}
              {...commonProps}
              control={control}
              fetchData={input.fetchData as FetchData<Pricelist[]>}
              onChange={input.onChange ?? undefined}
              getLabel={(p) => `${p.company.id} - ${p.name}`}
              getValue={(p) => p.id}
              groupBy={(p) => ({ id: p.company.id, name: p.company.name })}
              isClearable={!input.isDisabled}
            />
          );
        case "company":
          return (
            <SearchSelect<T, Company>
              key={key}
              isDisabled={input.isDisabled}
              {...commonProps}
              control={control}
              fetchData={input.fetchData as FetchData<Company[]>}
              onChange={input.onChange ?? undefined}
              getLabel={(p) => `${p.name} (${p.id})`}
              getValue={(p) => p.id}
              isClearable={!input.isDisabled}
            />
          );
      }
      break;
    case "textarea":
      return (
        <Textarea key={key} isDisabled={input.isDisabled} {...commonProps} />
      );
  }
}

function GenericForm<T extends FieldValues>({
  className,
  schema,
  config,
  values,
  method = "POST",
  id,
  isRow = false,
}: Props<T>) {
  const {
    register,
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors },
  } = useForm<T>({
    mode: "all",
    resolver: zodResolver(schema),
  });
  const errorDiv = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<T> = (data) => {
    console.log(values, data);

    usePost({
      endpoint: config.endpoint,
      body: data,
      method: method,
      schema: schema,
      fieldErrors: errors,
      setError: setError,
      setIsLoading: setIsLoading,
    });
  };

  useEffect(() => {
    if (values) {
      reset(values);
    }
  }, [values]);

  return (
    <form
      className={`flex flex-col gap-4 ${className}`}
      onSubmit={handleSubmit(onSubmit)}
      method={method}
      id={id}
    >
      {errors.root && (
        <div className="bg-opacity-10 border border-l-8 border-red-400 p-3 rounded-r-md">
          <div className="flex items-center gap-2">
            <FaExclamation className="text-red-400" />
            <span className="text-red-400">{errors.root.message}</span>
          </div>
        </div>
      )}

      {config.fieldset.map((fieldset, index) => (
        <Fieldset
          key={index}
          name={fieldset.title}
          className={`${isRow ? "flex-row " : "flex-col"}`}
        >
          {fieldset.inputs.map((input, inputIndex) => {
            return RenderInputField<T>(
              input,
              register,
              control,
              errors,
              values,
              `${index}-${inputIndex}`
            );
          })}
        </Fieldset>
      ))}
    </form>
  );
}

export default GenericForm;
