import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "../../lib/utils";

interface SearchableDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  label?: string;
}

export function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  error,
  label,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset search when closing
  useEffect(() => {
    if (!isOpen) {
      setSearch("");
      setActiveIndex(-1);
    }
  }, [isOpen]);

  // Keyboard navigation
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
          onChange(filteredOptions[activeIndex]);
          setIsOpen(false);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block inter">
          {label}
        </label>
      )}
      <div
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={cn(
          "flex h-[42px] w-full items-center justify-between rounded-lg border bg-white px-4 py-2.5 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all cursor-pointer group inter",
          error ? "border-red-400" : "border-gray-300",
          !value && "text-gray-400"
        )}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1.5 w-full rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150 ease-out">
          <div className="flex items-center border-b border-gray-100 px-3 pb-1.5 pt-1">
            <Search className="mr-2 h-4 w-4 shrink-0 text-gray-400" />
            <input
              autoFocus
              className="flex h-9 w-full bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 inter"
              placeholder="Search countries..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setActiveIndex(0);
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-[240px] overflow-y-auto mt-1 custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="py-6 px-3 text-sm text-gray-500 text-center inter">
                No countries found.
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={option}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(option);
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2.5 px-9 text-sm outline-none transition-colors inter",
                    index === activeIndex ? "bg-indigo-50 text-indigo-900" : "text-gray-700",
                    value === option && "bg-indigo-50 font-semibold text-indigo-600"
                  )}
                >
                  {value === option && (
                    <span className="absolute left-3 flex h-3.5 w-3.5 items-center justify-center">
                      <Check className="h-4 w-4 stroke-[3]" />
                    </span>
                  )}
                  {option}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {error && <p className="text-xs text-red-500 mt-1.5 inter">{error}</p>}
    </div>
  );
}
