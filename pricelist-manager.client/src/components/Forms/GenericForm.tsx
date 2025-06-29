import { z } from "zod/v4";
import { useEffect, useRef, useState } from "react";
import Fieldset from "./Fieldset";
import Input from "./Input";
import SearchableSelect from "./SearchableSelect";
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
import { useFetch, usePost } from "../../hooks/useGenericFetch";

type InferredZodSchema<T extends FieldValues> = z.ZodType<T, any, any>;

interface Props<T extends FieldValues> {
  className?: string;
  schema: InferredZodSchema<T>;
  config: Config<T>;
  values?: T;
  method?: "POST" | "PUT" | "DELETE";
  id: string;
}

interface BaseInput<T extends FieldValues> {
  id: Path<T>;
  label: string;
  registerOptions?: Partial<RegisterOptions<T>>;
  placeholder?: string;
}

interface NumberInput<T extends FieldValues> extends BaseInput<T> {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

interface SimpleInput<T extends FieldValues> extends BaseInput<T> {
  type: "text" | "email" | "password";
  maxLength?: number;
}

interface TextAreaInput<T extends FieldValues> extends BaseInput<T> {
  type: "textarea";
  maxLength?: number;
}

interface SearchableInput<T extends FieldValues> extends BaseInput<T> {
  type: "searchable";
  maxLength?: number;
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
  values: T | undefined
) {
  const commonProps = {
    id: input.id,
    placeholder: input.placeholder,
    register: register,
    registerOptions: input.registerOptions,
    label: input.label,
    error: errors[input.id]?.message?.toString() ?? undefined,
    value: values ? values[input.id] : undefined,
  };

  switch (input.type) {
    case "text":
    case "email":
    case "password":
      return <Input {...commonProps} type={input.type} />;
    case "number":
      return <Input {...commonProps} type={input.type} />;
    case "searchable":
      return <SearchableSelect<T> {...commonProps} control={control} />;
    case "textarea":
      return <Textarea {...commonProps} />;
  }
}

function GenericForm<T extends FieldValues>({
  className,
  schema,
  config,
  values,
  method = "POST",
  id
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
      setIsLoading: setIsLoading
    });
  }

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
        <div
          className="border-2 border-red-700 rounded p-8 bg-red-950"
          ref={errorDiv}
        >
          <p className="text-red-50">{errors.root.message}</p>
        </div>
      )}

      {config.fieldset.map((fieldset, index) => (
        <Fieldset key={index} name={fieldset.title}>
          {fieldset.inputs.map((input) => {
            return RenderInputField<T>(
              input,
              register,
              control,
              errors,
              values
            );
          })}
        </Fieldset>
      ))}
    </form>
  );
}

export default GenericForm;
