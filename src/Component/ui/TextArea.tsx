import React from "react";
import { getTheme } from "../../config/them.config";

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
  const theme = getTheme("light");

  return (
    <div className={`textarea-container flex flex-col gap-2 mb-4 ${props.className || ""}`}>
      <label className="text-sm text-gray-400 uppercase font-semibold" htmlFor={props.name}>
        {props.label}
      </label>

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
        className="border-2 rounded-lg p-2  text-[1.8vw] lg:text-lg resize-y"
        style={{
          borderColor: theme.borderColor.primary,
        }}
      />

      {props.error && <span className="error">{props.error}</span>}
    </div>
  );
};

export default TextArea;
