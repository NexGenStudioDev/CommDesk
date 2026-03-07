import React, { useEffect, useRef, useState } from "react";
import { getTheme, ThemeMode } from "../../config/them.config";
import { FaChevronDown } from "react-icons/fa";

type DropDownProps = {
  options: string[];

  label?: string;
  onSelect: (option: string) => void;
  className?: string;
  themeMode?: ThemeMode;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
};

const DropDown: React.FC<DropDownProps> = ({
  options,
  onSelect,
  className,
  label,
  themeMode = "light",
  value,
  placeholder = "Select an option",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value ?? options[0] ?? "");
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const theme = getTheme(themeMode);

  useEffect(() => {
    if (value !== undefined) {
      setSelected(value);
      return;
    }

    setSelected((previous) => {
      if (previous && options.includes(previous)) {
        return previous;
      }
      return options[0] ?? "";
    });
  }, [options, value]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
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
  const displayValue = selected || placeholder;

  return (
    <div ref={containerRef} className={`relative w-full sm:w-48 min-w-0 ${className || ""}`}>
      {label && (
        <p
          className="text-sm my-2 uppercase font-semibold tracking-wide"
          style={{
            color: theme.textColor.secondary,
            fontFamily: theme.fontFamily.primary,
          }}
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
        className="w-full border rounded-lg px-3 py-2 text-left flex justify-between items-center text-sm md:text-base transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-70"
        style={{
          borderColor: theme.borderColor.primary,
          backgroundColor: theme.background.secondary,
          color: selected ? theme.textColor.primary : theme.textColor.muted,
          fontFamily: theme.fontFamily.primary,
        }}
      >
        <span className="truncate">{displayValue}</span>
        <FaChevronDown
          className={`ml-2 shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && options.length > 0 && (
        <div
          className="absolute mt-2 w-full border rounded-lg shadow-md z-20 overflow-hidden max-h-60 overflow-y-auto"
          style={{
            borderColor: theme.borderColor.primary,
            backgroundColor: theme.background.primary,
          }}
          role="listbox"
        >
          {options.map((opt) => {
            const isHighlighted = hoveredOption === opt || selected === opt;

            return (
              <button
                type="button"
                key={opt}
                onClick={() => handleSelect(opt)}
                onMouseEnter={() => setHoveredOption(opt)}
                onMouseLeave={() => setHoveredOption(null)}
                className="w-full px-3 py-2 text-left text-sm md:text-base transition-colors duration-150"
                style={{
                  backgroundColor: isHighlighted
                    ? theme.background.tertiary
                    : theme.background.primary,
                  color: isHighlighted ? theme.textColor.primary : theme.textColor.secondary,
                  fontFamily: theme.fontFamily.primary,
                }}
              >
                <span className="block truncate">{opt}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DropDown;
