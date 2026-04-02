import React, { forwardRef } from "react";
import { getTheme } from "../../config/them.config";

type InputType = "text" | "email" | "password" | "number" | "url" | "tel" | "time";

type InputProps = {
  label?: string;
  name: string;
  placeholder?: string;
  value?: string | number;
  type?: InputType;

  onChange?: (name: string, value: string) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;

  error?: string;

  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  className?: string;
  inputClassName?: string;

  disabled?: boolean;
  required?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      name,
      placeholder,
      value,
      type = "text",
      onChange,
      onKeyDown,
      error,
      leftIcon,
      rightIcon,
      className = "",
      inputClassName = "",
      disabled,
      required,
    },
    ref,
  ) => {
    const theme = getTheme("light");

    return (
      <div className={`flex flex-col gap-2 mb-4 ${className}`}>
        {label && (
          <label htmlFor={name} className="text-sm text-gray-400 uppercase font-semibold inter">
            {label}
          </label>
        )}

        <div
          className={`flex items-center gap-2 border-2 rounded-lg px-3 py-2 ${
            error ? "border-red-500" : ""
          }`}
          style={{
            borderColor: error ? "red" : theme.borderColor.primary,
          }}
        >
          {/* Left Icon */}
          {leftIcon && <div className="flex items-center text-gray-400">{leftIcon}</div>}

          {/* Input Field */}
          <input
            ref={ref}
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            disabled={disabled}
            required={required}
            onKeyDown={onKeyDown}
            onChange={(e) => onChange?.(name, e.target.value)}
            className={`flex-1 bg-transparent outline-none  text-[1.8vw] lg:text-lg ${inputClassName}`}
          />

          {/* Right Icon */}
          {rightIcon && <div className="flex items-center text-gray-400">{rightIcon}</div>}
        </div>

        {/* Error Message */}
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>
    );
  },
);

export default Input;
