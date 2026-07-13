"use client";

import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
} from "react-hook-form";

import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";

interface FormInputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: string;
}

export function FormInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  type = "text",
  placeholder,
}: FormInputProps<TFieldValues, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel htmlFor={name}>
            {label}
          </FieldLabel>

          <FieldContent>
            <Input
              id={name}
              type={type}
              placeholder={placeholder}
              {...field}
            />
          </FieldContent>

          <FieldError
            errors={fieldState.error ? [fieldState.error] : []}
          />
        </Field>
      )}
    />
  );
}