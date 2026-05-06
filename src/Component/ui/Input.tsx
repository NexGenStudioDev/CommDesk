import React, { forwardRef } from "react";

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
    return (
      <div className={`flex flex-col gap-1.5 mb-4 ${className}`}>
        {label && (
          <label
            htmlFor={name}
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--cd-text-2)" }}
          >
            {label}
          </label>
        )}

        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 border transition-all duration-150"
          style={{
            backgroundColor: "var(--cd-surface)",
            borderColor: error ? "var(--cd-danger)" : "var(--cd-border)",
            boxShadow: error ? "0 0 0 3px var(--cd-danger-subtle)" : undefined,
          }}
        >
          {leftIcon && (
            <div className="flex items-center" style={{ color: "var(--cd-text-muted)" }}>
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
            style={{ color: "var(--cd-text)" }}
          />

          {rightIcon && (
            <div className="flex items-center" style={{ color: "var(--cd-text-muted)" }}>
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <span className="text-xs" style={{ color: "var(--cd-danger)" }}>
            {error}
          </span>
        )}
      </div>
    );
  },
);

export default Input;
