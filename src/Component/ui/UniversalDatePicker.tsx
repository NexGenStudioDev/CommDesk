import React, { forwardRef, useEffect, useState } from "react";

type PickerMode = "date" | "time" | "datetime-local";

export type UniversalDatePickerProps = {
  label?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  mode?: PickerMode;
  onChange?: (name: string, value: string) => void;
  error?: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
  required?: boolean;
  min?: string;
  max?: string;
  step?: number;
  themeMode?: string;
};

export const UniversalDatePicker = forwardRef<HTMLInputElement, UniversalDatePickerProps>(
  (
    {
      label,
      name,
      value,
      defaultValue = "",
      placeholder,
      mode = "date",
      onChange,
      error,
      className = "",
      inputClassName = "",
      labelClassName = "",
      disabled = false,
      required = false,
      min,
      max,
      step,
      themeMode: _themeMode = "light",
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);

    useEffect(() => {
      if (!isControlled) {
        setInternalValue(defaultValue);
      }
    }, [defaultValue, isControlled]);

    const resolvedName =
      name ?? (mode === "time" ? "time" : mode === "datetime-local" ? "dateTime" : "date");

    const fieldValue = isControlled ? (value ?? "") : internalValue;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value;

      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onChange?.(resolvedName, nextValue);
    };

    return (
      <div className={`flex w-full flex-col gap-2 mb-4 ${className}`}>
        {label && (
          <label
            htmlFor={resolvedName}
            className={`text-sm text-gray-400 uppercase font-semibold ${labelClassName}`}
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={resolvedName}
          name={resolvedName}
          type={mode}
          value={fieldValue}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          min={min}
          max={max}
          step={step}
          onChange={handleChange}
          className={`w-full border-2 rounded-lg px-3 py-2 bg-transparent outline-none text-lg ${inputClassName}`}
          style={{
            borderColor: error ? "var(--cd-danger)" : "var(--cd-border)",
            color: "var(--cd-text)",
            fontFamily: "inherit",
          }}
        />

        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>
    );
  },
);

export default UniversalDatePicker;
