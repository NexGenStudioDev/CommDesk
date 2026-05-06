import React from "react";

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
  return (
    <div className={`flex flex-col gap-1.5 mb-4 ${props.className || ""}`}>
      {props.label && (
        <label
          className="text-xs font-semibold uppercase tracking-wider"
          htmlFor={props.name}
          style={{ color: "var(--cd-text-2)" }}
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
          backgroundColor: "var(--cd-surface)",
          borderColor: props.error ? "var(--cd-danger)" : "var(--cd-border)",
          color: "var(--cd-text)",
        }}
      />

      {props.error && (
        <span className="text-xs" style={{ color: "var(--cd-danger)" }}>
          {props.error}
        </span>
      )}
    </div>
  );
};

export default TextArea;
