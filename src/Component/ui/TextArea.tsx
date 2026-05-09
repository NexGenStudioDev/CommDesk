import React from "react";
import { useTheme } from "@/theme";

type TextAreaProps = {
  label?: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (name: string, value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  error?: string;
  className?: string;
  rows?: number;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
};

export const TextArea = (props: TextAreaProps) => {
  const { theme } = useTheme();

  return (
    <div className={`flex flex-col gap-1.5 mb-4 ${props.className || ""}`}>
      {props.label && (
        <label
          className="text-xs font-semibold uppercase tracking-wider"
          htmlFor={props.name}
          style={{ color: theme.text.secondary }}
        >
          {props.label}
        </label>
      )}

      <textarea
        id={props.name}
        name={props.name}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(props.name, e.target.value)}
        onKeyDown={props.onKeyDown}
        onBlur={props.onBlur}
        rows={props.rows || 4}
        disabled={props.disabled}
        required={props.required}
        maxLength={props.maxLength}
        className="rounded-lg p-3 text-sm resize-y outline-none border transition-all duration-150"
        style={{
          backgroundColor: theme.bg.surface,
          borderColor: props.error ? theme.danger.default : theme.border.default,
          color: theme.text.primary,
        }}
      />

      {props.error && (
        <span className="text-xs" style={{ color: theme.danger.default }}>
          {props.error}
        </span>
      )}
    </div>
  );
};

export default TextArea;
