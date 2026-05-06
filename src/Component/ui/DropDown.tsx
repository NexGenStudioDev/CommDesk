import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

type DropDownProps = {
  options: string[];
  label?: string;
  onSelect: (option: string) => void;
  className?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
};

const DropDown: React.FC<DropDownProps> = ({
  options,
  onSelect,
  className,
  label,
  value,
  placeholder = "Select an option",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value ?? options[0] ?? "");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setSelected(value);
      return;
    }
    setSelected((prev) => (prev && options.includes(prev) ? prev : (options[0] ?? "")));
  }, [options, value]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleSelect = (opt: string) => {
    if (disabled) return;
    setSelected(opt);
    onSelect(opt);
    setOpen(false);
  };

  const isDisabled = disabled || options.length === 0;

  return (
    <div ref={containerRef} className={`relative w-full ${className || ""}`}>
      {label && (
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-1.5"
          style={{ color: "var(--cd-text-2)" }}
        >
          {label}
        </p>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={isDisabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full rounded-lg px-3 py-2 text-left flex justify-between items-center text-sm transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60"
        style={{
          backgroundColor: "var(--cd-surface)",
          borderColor: "var(--cd-border)",
          color: selected ? "var(--cd-text)" : "var(--cd-text-muted)",
          border: "1px solid var(--cd-border)",
        }}
      >
        <span className="truncate">{selected || placeholder}</span>
        <FaChevronDown
          className={`ml-2 shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          style={{ color: "var(--cd-text-muted)" }}
        />
      </button>

      {open && options.length > 0 && (
        <div
          className="absolute mt-1 w-full rounded-lg z-20 overflow-hidden max-h-60 overflow-y-auto"
          style={{
            backgroundColor: "var(--cd-surface)",
            border: "1px solid var(--cd-border)",
            boxShadow: "0 8px 24px var(--cd-shadow-md)",
          }}
          role="listbox"
        >
          {options.map((opt) => (
            <button
              type="button"
              key={opt}
              onClick={() => handleSelect(opt)}
              className="w-full px-3 py-2 text-left text-sm transition-colors duration-100"
              style={{
                backgroundColor: selected === opt ? "var(--cd-primary-subtle)" : "transparent",
                color: selected === opt ? "var(--cd-primary-text)" : "var(--cd-text)",
              }}
              onMouseEnter={(e) => {
                if (selected !== opt)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "var(--cd-hover)";
              }}
              onMouseLeave={(e) => {
                if (selected !== opt)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropDown;
