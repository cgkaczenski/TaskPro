"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { FormErrors } from "./form-errors";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FormDatePickerProps {
  id: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  onDateChange?: (dateRange: DateRange | undefined) => void;
  defaultValue?: DateRange;
}

export const FormDatePicker = ({
  id,
  label,
  placeholder,
  disabled,
  errors,
  onDateChange,
  className,
  defaultValue,
}: FormDatePickerProps) => {
  const { pending } = useFormStatus();
  const [date, setDate] = React.useState<DateRange | undefined>(defaultValue);

  const handleDateChange = (dateRange: DateRange | undefined) => {
    setDate(dateRange);
    onDateChange?.(dateRange);
  };

  const formatDate = (date: Date | undefined) => {
    return date ? format(date, "LLL dd, y") : "";
  };

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
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={id}
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground",
                className
              )}
              aria-describedby={`${id}-error`}
              disabled={pending || disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {formatDate(date.from)} - {formatDate(date.to)}
                  </>
                ) : (
                  formatDate(date.from)
                )
              ) : (
                <span>{placeholder}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <input
          type="hidden"
          name={id}
          value={date ? JSON.stringify(date) : ""}
        />
      </div>
      <FormErrors id={id} errors={errors} />
    </div>
  );
};
