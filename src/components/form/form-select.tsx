"use client";
import { useFormStatus } from "react-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormErrors } from "./form-errors";

interface FormSelectProps {
  id: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  options: { label: string; value: string }[];
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({
    id,
    label,
    placeholder,
    required,
    disabled,
    errors,
    onValueChange,
    className,
    defaultValue,
    options,
  }) => {
    const { pending } = useFormStatus();

    return (
      <div className="space-y-2 w-full">
        <div className="space-y-1 w-full">
          {label ? (
            <Label
              htmlFor={id}
              className="text-xs font-semibold text-neutral-700"
            >
              {label}
            </Label>
          ) : null}
          <Select
            onValueChange={onValueChange}
            required={required}
            name={id}
            disabled={pending || disabled}
            defaultValue={defaultValue}
          >
            <SelectTrigger
              className={cn("w-full shadow-sm", className)}
              aria-describedby={`${id}-error`}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <FormErrors id={id} errors={errors} />
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";
