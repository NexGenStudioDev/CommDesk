import React, { forwardRef } from "react";
import { useTheme } from "@/theme";

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
    const { theme } = useTheme();

    return (
      <div className={`flex flex-col gap-1.5 mb-4 ${className}`}>
        {label && (
          <label
            htmlFor={name}
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: theme.text.secondary }}
          >
            {label}
          </label>
        )}

        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 border transition-all duration-150"
          style={{
            backgroundColor: theme.bg.surface,
            borderColor: error ? theme.danger.default : theme.border.default,
            boxShadow: error ? `0 0 0 3px ${theme.danger.subtle}` : undefined,
          }}
        >
          {leftIcon && (
            <div className="flex items-center" style={{ color: theme.text.muted }}>
              {leftIcon}
            </div>
          )}

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
            className={`flex-1 bg-transparent outline-none text-sm ${inputClassName}`}
            style={{ color: theme.text.primary }}
          />

          {rightIcon && (
            <div className="flex items-center" style={{ color: theme.text.muted }}>
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <span className="text-xs" style={{ color: theme.danger.default }}>
            {error}
          </span>
        )}
      </div>
    );
  },
);

export default Input;
