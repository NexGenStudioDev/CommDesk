import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Search, X, SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import type { WebhookFilters, WebhookStatus } from "../../Webhook.types";

interface Props {
  filters: WebhookFilters;
  onChange: (f: WebhookFilters) => void;
  filteredCount: number;
  totalCount: number;
}

const STATUS_DOTS: Record<string, string> = { all: "bg-gray-400", active: "bg-emerald-500", inactive: "bg-gray-500" };

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  active: { bg: "var(--cd-success-subtle)", color: "var(--cd-success)", border: "var(--cd-success-subtle)" },
  inactive: { bg: "var(--cd-surface-3)", color: "var(--cd-text-2)", border: "var(--cd-border)" },
};

function useDropdown() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!btnRef.current?.contains(t) && !panelRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  return { open, setOpen, btnRef, panelRef };
}

function DropdownPortal({ btnRef, panelRef, open, children }: {
  btnRef: React.RefObject<HTMLButtonElement | null>;
  panelRef: React.RefObject<HTMLDivElement | null>;
  open: boolean;
  children: React.ReactNode;
}) {
  const [style, setStyle] = useState<React.CSSProperties>({});
  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom;
    if (below < 240 && rect.top > below)
      setStyle({ position: "fixed", left: rect.left, bottom: window.innerHeight - rect.top + 6, zIndex: 9999 });
    else
      setStyle({ position: "fixed", left: rect.left, top: rect.bottom + 6, zIndex: 9999 });
  }, [open, btnRef]);
  if (!open) return null;
  return createPortal(
    <div
      ref={panelRef}
      style={{
        ...style,
        backgroundColor: "var(--cd-surface)",
        border: "1px solid var(--cd-border)",
        boxShadow: "0 18px 48px -24px var(--cd-shadow-md)",
      }}
      className="rounded-lg py-1 overflow-hidden min-w-[150px]"
    >
      {children}
    </div>,
    document.body
  );
}

export function PillDropdown<T extends string>({ label: pillLabel, value, options, onChange, dotMap, styleMap }: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  dotMap: Record<string, string>;
  styleMap: Record<string, { bg: string; color: string; border: string }>;
}) {
  const { open, setOpen, btnRef, panelRef } = useDropdown();
  const isActive = value !== options[0].value;
  const current = options.find((o) => o.value === value)?.label ?? pillLabel;
  const activeStyle = styleMap[value] ?? { bg: "var(--cd-primary)", color: "#fff", border: "var(--cd-primary)" };

  return (
    <div className="relative shrink-0">
      <button
        ref={btnRef}
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-all whitespace-nowrap select-none hover:bg-[var(--cd-hover)]"
        style={{
          backgroundColor: isActive ? activeStyle.bg : "var(--cd-surface-2)",
          color: isActive ? activeStyle.color : "var(--cd-text-2)",
          borderColor: isActive ? activeStyle.border : "var(--cd-border)",
        }}
      >
        {isActive && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotMap[value] ?? "bg-white"} opacity-80`} />}
        {current}
        <ChevronDown
          size={11}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          style={{ opacity: isActive ? 0.7 : 1 }}
        />
      </button>

      <DropdownPortal btnRef={btnRef} panelRef={panelRef} open={open}>
        {options.map((opt) => (
          <button
            key={opt.value}
            onMouseDown={(e) => { e.preventDefault(); onChange(opt.value); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-left transition-colors"
            style={{
              backgroundColor: opt.value === value ? "var(--cd-surface-2)" : "transparent",
              color: opt.value === value ? "var(--cd-text)" : "var(--cd-text-2)",
            }}
            onMouseEnter={(e) => {
              if (opt.value !== value)
                (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cd-hover)";
            }}
            onMouseLeave={(e) => {
              if (opt.value !== value)
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
            }}
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${dotMap[opt.value] ?? "bg-gray-300"}`} />
            <span className="flex-1">{opt.label}</span>
            {opt.value === value && <Check size={12} style={{ color: "var(--cd-primary)" }} className="shrink-0" />}
          </button>
        ))}
      </DropdownPortal>
    </div>
  );
}

export default function WebhookFiltersBar({ filters, onChange, filteredCount, totalCount }: Props) {
  const [localSearch, setLocalSearch] = useState(filters.search);
  const onChangeRef = useRef(onChange);
  
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  useEffect(() => {
    if (localSearch === filters.search) return;
    const timer = setTimeout(() => {
      onChangeRef.current({ ...filters, search: localSearch });
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, filters]);

  const hasActive = filters.status !== "all" || filters.search !== "";

  const resetAll = () => {
    setLocalSearch("");
    onChange({ status: "all", search: "" });
  };

  return (
    <div
      className="border-b transition-all duration-300"
      style={{
        backgroundColor: "var(--cd-bg)",
        borderColor: "var(--cd-border-subtle)",
      }}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center gap-3 px-5 py-4 sm:px-8 lg:px-10">
        <SlidersHorizontal size={14} style={{ color: "var(--cd-text-muted)" }} className="shrink-0 mr-1" />

        {/* Status Dropdown */}
        <PillDropdown<WebhookStatus | "all">
          label="Status"
          value={filters.status}
          dotMap={STATUS_DOTS}
          styleMap={STATUS_STYLES}
          onChange={(v) => onChange({ ...filters, status: v })}
          options={[
            { value: "all", label: "All Status" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />

        {/* Search */}
        <div className="relative min-w-[220px] flex-1 max-w-sm">
          <div
            className="flex h-8 w-full items-center gap-2 rounded-lg border pl-3 pr-2 transition-all"
            style={{
              backgroundColor: "var(--cd-surface)",
              borderColor: localSearch ? "var(--cd-primary)" : "var(--cd-border)",
            }}
          >
            <Search size={13} style={{ color: "var(--cd-text-muted)" }} />
            <input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search webhooks by name or URL..."
              className="flex-1 text-xs bg-transparent outline-none min-w-0"
              style={{ color: "var(--cd-text)" }}
            />
            {localSearch && (
              <button onClick={() => setLocalSearch("")} className="hover:text-[var(--cd-text)] text-[var(--cd-text-muted)]">
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {hasActive && (
          <button
            onClick={resetAll}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-[var(--cd-border)] bg-transparent px-2.5 text-xs font-medium text-[var(--cd-text-2)] hover:bg-[var(--cd-hover)] hover:text-[var(--cd-text)] transition-colors"
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-5 pb-4 sm:px-8 lg:px-10">
        <p className="text-xs font-medium" style={{ color: "var(--cd-text-muted)" }}>
          {hasActive ? (
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-[var(--cd-primary)]" />
              Showing <span className="text-[var(--cd-text)] font-bold">{filteredCount}</span> results
            </span>
          ) : (
            `Total webhooks: ${totalCount}`
          )}
        </p>
      </div>
    </div>
  );
}
