import { useEffect, useRef, useState, type ChangeEventHandler } from "react";
import Fieldset from "./Fieldset";
import Input from "./Input";
import Textarea from "./Textarea";
import {
  FormProvider,
  useForm,
  useFormContext,
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
import { FaExclamation, FaPaperPlane } from "react-icons/fa6";
import SearchSelect from "./SearchSelect";
import { PricelistArraySchema, type Pricelist } from "../../models/Pricelist";
import type { z, ZodType } from "zod/v4";
import type { FetchData } from "../../types";
import type { Company } from "../../models/Company";
import type { Product } from "../../models/Product";
import isEqual from "lodash.isequal";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import FormButton from "../Buttons/FormButton";
import SimpleIconButton from "../Buttons/SimpleButton";
import ActionButton from "../Buttons/ActionButton";

type InferredZodSchema<T extends FieldValues> = z.ZodType<T, any, any>;

interface Props<T extends FieldValues> {
  className?: string;
  schema: InferredZodSchema<T>;
  config: Config<T>;
  values?: T;
  resetValues?: T;
  method?: "POST" | "PUT" | "DELETE";
  id: string;
  isRow?: boolean;
  externalProvider?: boolean;
  mutation?: UseMutationResult<any, Error, any, unknown>;
  onSuccess?: (data: any) => void;
  clearOnSubmit?: boolean;
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
  fetchData: UseQueryResult<Pricelist[] | Product[] | Company[], Error>;
  onChange?: (value: string) => void;
}

export type InputConfig<T extends FieldValues> =
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
  submitButton?:
    | {
        label: string;
        isLoading: boolean;
      }
    | undefined;
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
              fetchData={input.fetchData as UseQueryResult<Pricelist[]>}
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
              fetchData={input.fetchData as UseQueryResult<Company[]>}
              onChange={input.onChange ?? undefined}
              getLabel={(p) => `${p.name} (${p.id})`}
              getValue={(p) => p.id}
              isClearable={!input.isDisabled}
            />
          );
        case "product":
          return (
            <SearchSelect<T, Product>
              key={key}
              isDisabled={input.isDisabled}
              {...commonProps}
              control={control}
              fetchData={input.fetchData as UseQueryResult<Product[]>}
              onChange={input.onChange ?? undefined}
              getLabel={(p) => `${p.id} - ${p.currentInstance.name}`}
              getValue={(p) => p.id}
              isClearable={!input.isDisabled}
              isMulti={true}
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

function GenericForm<T extends FieldValues>(prop: Props<T>) {
  if (prop.externalProvider) {
    return <GenericActualForm<T> {...prop} />;
  }

  return (
    <GenericFormProvider schema={prop.schema}>
      <GenericActualForm<T> {...prop} />
    </GenericFormProvider>
  );
}

function GenericActualForm<T extends FieldValues>({
  className,
  config,
  values,
  method = "POST",
  id,
  isRow = false,
  mutation,
  onSuccess,
  clearOnSubmit = false,
  resetValues = {} as T,
}: Props<T>) {
  const errorDiv = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const methods = useFormContext<T>();

  const onSubmit: SubmitHandler<T> = (data) => {
    if (isEqual(data, values)) {
      return;
    }

    mutation?.mutate(data, {
      onSuccess: (responseData) => {
        if (onSuccess) {
          onSuccess(responseData);
        }
      },
    });
  };

  useEffect(() => {
    if (values) {
      methods.reset(values);
    }
  }, [values]);

  return (
    <form
      className={`flex flex-col gap-4 ${className}`}
      onSubmit={methods.handleSubmit(onSubmit)}
      method={method}
      id={id}
    >
      {methods.formState.errors.root && (
        <div className="bg-opacity-10 border border-l-8 border-red-400 p-3 rounded-r-md">
          <div className="flex items-center gap-2">
            <FaExclamation className="text-red-400" />
            <span className="text-red-400">
              {methods.formState.errors.root.message}
            </span>
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
              methods.register,
              methods.control,
              methods.formState.errors,
              values,
              `${index}-${inputIndex}`
            );
          })}
        </Fieldset>
      ))}

      {config.submitButton && (
        <button
          type="submit"
          className={`p-2 rounded flex gap-2 items-center bg-blue-600 hover:bg-blue-700 transition-colors`}
        >
          <FaPaperPlane className="text-white" />
          Login
        </button>
      )}
    </form>
  );
}

export function GenericFormProvider<T extends FieldValues>({
  schema,
  children,
}: {
  schema: InferredZodSchema<T>;
  children: React.ReactNode;
}) {
  const methods = useForm<T>({
    mode: "onSubmit",
    resolver: zodResolver(schema),
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

export default GenericForm;
