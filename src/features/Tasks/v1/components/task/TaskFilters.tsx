import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Search, X, SlidersHorizontal, ChevronDown, Check, Star } from "lucide-react";
import { mockMembers } from "../../mock/taskMockData";
import type { TaskFilters, TaskStatus, TaskPriority } from "../../Task.types";

interface Props {
  filters: TaskFilters;
  onChange: (f: TaskFilters) => void;
  totalCount: number;
  filteredCount: number;
}

const STATUS_DOTS:   Record<string, string> = { all: "bg-gray-400", todo: "bg-gray-500", "in-progress": "bg-indigo-500", completed: "bg-emerald-500" };
const TIME_DOTS:     Record<string, string> = { all: "bg-gray-400", upcoming: "bg-sky-500", past: "bg-red-500", completed: "bg-emerald-500" };
const PRIORITY_DOTS: Record<string, string> = { all: "bg-gray-400", high: "bg-red-500", medium: "bg-amber-400", low: "bg-sky-400" };

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  todo: { bg: "var(--cd-surface-3)", color: "var(--cd-text-2)", border: "var(--cd-border)" },
  "in-progress": { bg: "rgba(97, 95, 255, 0.16)", color: "#A7C7FF", border: "rgba(97, 95, 255, 0.38)" },
  completed: { bg: "var(--cd-success-subtle)", color: "var(--cd-success)", border: "var(--cd-success-subtle)" },
};
const TIME_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  upcoming: { bg: "var(--cd-primary-subtle)", color: "var(--cd-primary-text)", border: "var(--cd-primary-subtle)" },
  past: { bg: "var(--cd-danger-subtle)", color: "var(--cd-danger)", border: "var(--cd-danger-subtle)" },
  completed: { bg: "var(--cd-success-subtle)", color: "var(--cd-success)", border: "var(--cd-success-subtle)" },
};
const PRIORITY_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  high: { bg: "var(--cd-danger-subtle)", color: "var(--cd-danger)", border: "var(--cd-danger-subtle)" },
  medium: { bg: "var(--cd-warning-subtle)", color: "var(--cd-warning)", border: "var(--cd-warning-subtle)" },
  low: { bg: "var(--cd-primary-subtle)", color: "var(--cd-primary-text)", border: "var(--cd-primary-subtle)" },
};

// ─── Dropdown state hook ──────────────────────────────────────────────────────
function useDropdown() {
  const [open, setOpen] = useState(false);
  const btnRef   = useRef<HTMLButtonElement>(null);
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

// ─── Portal panel ─────────────────────────────────────────────────────────────
function DropdownPortal({ btnRef, panelRef, open, children }: {
  btnRef: React.RefObject<HTMLButtonElement | null>;
  panelRef: React.RefObject<HTMLDivElement | null>;
  open: boolean;
  children: React.ReactNode;
}) {
  const [style, setStyle] = useState<React.CSSProperties>({});
  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const rect  = btnRef.current.getBoundingClientRect();
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
        boxShadow: "0 8px 24px var(--cd-shadow-md)",
      }}
      className="rounded-xl py-1 overflow-hidden min-w-[150px]"
    >
      {children}
    </div>,
    document.body
  );
}

// ─── Generic pill dropdown ────────────────────────────────────────────────────
function PillDropdown<T extends string>({ label: pillLabel, value, options, onChange, dotMap, styleMap }: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  dotMap: Record<string, string>;
  styleMap: Record<string, { bg: string; color: string; border: string }>;
}) {
  const { open, setOpen, btnRef, panelRef } = useDropdown();
  const isActive = value !== options[0].value;
  const current  = options.find((o) => o.value === value)?.label ?? pillLabel;
  const activeStyle = styleMap[value] ?? { bg: "var(--cd-primary)", color: "#fff", border: "var(--cd-primary)" };

  return (
    <div className="relative shrink-0">
      <button
        ref={btnRef}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap select-none"
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

// ─── Member multi-select ──────────────────────────────────────────────────────
function MemberFilter({ selected, onChange }: { selected: string[]; onChange: (ids: string[]) => void }) {
  const { open, setOpen, btnRef, panelRef } = useDropdown();
  const isActive = selected.length > 0;
  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);

  return (
    <div className="relative shrink-0">
      <button
        ref={btnRef}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all select-none"
        style={{
          backgroundColor: isActive ? "var(--cd-secondary)" : "var(--cd-surface-2)",
          color: isActive ? "#fff" : "var(--cd-text-2)",
          borderColor: isActive ? "var(--cd-secondary)" : "var(--cd-border)",
        }}
      >
        {isActive && (
          <span className="flex -space-x-1.5">
            {selected.slice(0, 2).map((id) => {
              const m = mockMembers.find((x) => x.id === id);
              return m ? (
                <img key={id} src={m.avatar} alt={m.name} className="w-4 h-4 rounded-full border border-white object-cover" />
              ) : null;
            })}
          </span>
        )}
        {isActive ? `${selected.length} Member${selected.length > 1 ? "s" : ""}` : "Members"}
        <ChevronDown size={11} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <DropdownPortal btnRef={btnRef} panelRef={panelRef} open={open}>
        {mockMembers.map((m) => {
          const isSel = selected.includes(m.id);
          return (
            <button
              key={m.id}
              onMouseDown={(e) => { e.preventDefault(); toggle(m.id); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors"
              style={{ backgroundColor: isSel ? "var(--cd-primary-subtle)" : "transparent" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor = isSel ? "var(--cd-primary-subtle)" : "var(--cd-hover)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor = isSel ? "var(--cd-primary-subtle)" : "transparent")
              }
            >
              <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: isSel ? "var(--cd-primary-text)" : "var(--cd-text)" }}>
                  {m.name}
                </p>
                <p className="text-[10px] truncate" style={{ color: "var(--cd-text-muted)" }}>{m.role}</p>
              </div>
              {isSel && (
                <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--cd-primary)" }}>
                  <Check size={9} className="text-white" />
                </div>
              )}
            </button>
          );
        })}
        {isActive && (
          <>
            <div className="border-t my-1" style={{ borderColor: "var(--cd-border)" }} />
            <button
              onMouseDown={(e) => { e.preventDefault(); onChange([]); }}
              className="w-full px-3 py-1.5 text-xs font-semibold text-left"
              style={{ color: "var(--cd-danger)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--cd-danger-subtle)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
            >
              Clear all
            </button>
          </>
        )}
      </DropdownPortal>
    </div>
  );
}

// ─── Smart search with suggestions ───────────────────────────────────────────
function SmartSearch({ value, onChange, filteredCount, tasks }: {
  value: string;
  onChange: (v: string) => void;
  filteredCount: number;
  totalCount: number;
  isFiltered: boolean;
  tasks: Task[];
}) {
  const [focused, setFocused] = useState(false);
  const { open, setOpen, btnRef, panelRef } = useDropdown();
  const hasResults = !value || filteredCount > 0;

  // Suggestions logic
  const suggestions = (() => {
    const q = value.toLowerCase().trim();
    const items: { id: string; label: string; type: "title" | "tech" | "member" | "status" | "recent" }[] = [];

    if (q === "") {
      // 0. Quick/Popular Suggestions when empty
      // Popular tech
      const popularTech = ["React", "TypeScript", "Tailwind", "Python", "Figma"];
      popularTech.forEach(t => items.push({ id: `pop-${t}`, label: t, type: "tech" }));
      
      // Common statuses
      items.push({ id: "status-todo", label: "Todo", type: "status" });
      items.push({ id: "status-ip", label: "In Progress", type: "status" });
      
      return items;
    }

    // 1. Task Titles
    tasks.forEach(t => {
      if (t.title.toLowerCase().includes(q)) {
        items.push({ id: `t-${t.id}`, label: t.title, type: "title" });
      }
    });

    // 2. Tech Tags (Unique)
    const techSet = new Set<string>();
    tasks.forEach(t => {
      t.technologies?.forEach(tech => {
        if (tech.label.toLowerCase().includes(q) && !techSet.has(tech.id)) {
          techSet.add(tech.id);
          items.push({ id: `tech-${tech.id}`, label: tech.label, type: "tech" });
        }
      });
    });

    // 3. Members (Unique)
    const memSet = new Set<string>();
    tasks.forEach(t => {
      t.assignedTo.forEach(m => {
        if (m.name.toLowerCase().includes(q) && !memSet.has(m.id)) {
          memSet.add(m.id);
          items.push({ id: `m-${m.id}`, label: m.name, type: "member" });
        }
      });
    });

    return items.slice(0, 10);
  })();

  const showSuggestions = open && suggestions.length > 0;

  return (
    <div className="relative shrink-0" ref={panelRef as any}>
      <div
        className={`flex items-center gap-1.5 pl-2.5 pr-2 py-1.5 rounded-full border transition-all ${
          focused || open ? "w-64 sm:w-80" : value ? "w-48 sm:w-64" : "w-44 sm:w-64"
        }`}
        style={{
          backgroundColor: focused || open ? "var(--cd-surface)" : "var(--cd-surface-2)",
          borderColor: focused || open ? "var(--cd-primary)" : value ? "var(--cd-primary)" : "var(--cd-border)",
          boxShadow: focused || open ? "0 0 0 3px var(--cd-primary-subtle)" : "none",
        }}
      >
        <Search size={13} className="shrink-0 transition-colors" style={{ color: focused || open || value ? "var(--cd-primary)" : "var(--cd-text-muted)" }} />

        <input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setFocused(true);
            setOpen(true);
          }}
          onBlur={() => setFocused(false)}
          placeholder="Search task, tech, members..."
          className="flex-1 text-xs bg-transparent outline-none min-w-0 truncate"
          style={{ color: "var(--cd-text)", caretColor: "var(--cd-primary)" }}
        />

        {value && (
          <span
            className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors"
            style={{
              backgroundColor: hasResults ? "var(--cd-primary-subtle)" : "var(--cd-danger-subtle)",
              color: hasResults ? "var(--cd-primary-text)" : "var(--cd-danger)",
            }}
          >
            {filteredCount}
          </span>
        )}

        {value && (
          <button onClick={() => { onChange(""); setOpen(false); }} className="shrink-0 transition-colors hover:text-[var(--cd-text)]" style={{ color: "var(--cd-text-muted)" }}>
            <X size={12} />
          </button>
        )}
      </div>

      {showSuggestions && (
        <div 
          className="absolute z-50 top-full left-0 right-0 mt-2 p-2 rounded-2xl border shadow-2xl overflow-hidden"
          style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border)" }}
        >
          <div className="flex items-center justify-between px-2.5 py-1.5 mb-1">
            <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: "var(--cd-text-muted)" }}>
              {value ? "Search Results" : "Quick Discovery"}
            </p>
            {!value && <Star size={10} className="text-[var(--cd-warning)]" />}
          </div>
          <div 
            className="flex flex-col gap-0.5 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar"
            style={{ overscrollBehaviorY: "contain" }}
          >
            {suggestions.map((s) => (
              <button
                key={s.id}
                onClick={() => { onChange(s.label); setOpen(false); }}
                className="w-full flex items-center justify-between gap-3 p-1.5 rounded-xl transition-all hover:bg-[var(--cd-hover)] hover:translate-x-1 text-left group"
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className="w-1.5 h-1.5 rounded-full opacity-40 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: "var(--cd-primary)" }} />
                  <span className="text-[11px] font-semibold truncate" style={{ color: "var(--cd-text)" }}>{s.label}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter bg-[var(--cd-surface-3)] text-[var(--cd-text-muted)] group-hover:bg-[var(--cd-primary-subtle)] group-hover:text-[var(--cd-primary-text)] transition-colors">{s.type}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main filters bar ─────────────────────────────────────────────────────────
interface TaskFiltersBarProps extends Props {
  tasks: Task[];
}

export default function TaskFiltersBar({ filters, onChange, totalCount, filteredCount, tasks }: TaskFiltersBarProps) {
  const [localSearch, setLocalSearch] = useState(filters.search);
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; });

  useEffect(() => {
    if (localSearch === filters.search) return;
    const timer = setTimeout(() => {
      onChangeRef.current({ ...filters, search: localSearch });
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, filters]);

  const hasActive =
    filters.status !== "all" || filters.priority !== "all" ||
    filters.time !== "all" || filters.members.length > 0 || filters.search !== "";
  const resetAll = () => {
    setLocalSearch("");
    onChange({ status: "all", priority: "all", time: "all", members: [], search: "" });
  };

  return (
    <div className="border-b" style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border)" }}>
      {/* Filter pills row */}
      <div className="flex items-center gap-3 px-6 sm:px-10 py-4 flex-wrap">
        <SlidersHorizontal size={14} className="shrink-0" style={{ color: "var(--cd-text-muted)" }} />

        <PillDropdown<TaskStatus | "all">
          label="Status"
          value={filters.status}
          dotMap={STATUS_DOTS}
          styleMap={STATUS_STYLES}
          onChange={(v) => onChange({ ...filters, status: v })}
          options={[
            { value: "all",         label: "Status"      },
            { value: "todo",        label: "Todo"        },
            { value: "in-progress", label: "In Progress" },
            { value: "completed",   label: "Completed"   },
          ]}
        />

        <PillDropdown<"all" | "upcoming" | "past" | "completed">
          label="Time"
          value={filters.time}
          dotMap={TIME_DOTS}
          styleMap={TIME_STYLES}
          onChange={(v) => onChange({ ...filters, time: v })}
          options={[
            { value: "all",       label: "Time"      },
            { value: "upcoming",  label: "Upcoming"  },
            { value: "past",      label: "Past"      },
            { value: "completed", label: "Completed" },
          ]}
        />

        <PillDropdown<TaskPriority | "all">
          label="Priority"
          value={filters.priority}
          dotMap={PRIORITY_DOTS}
          styleMap={PRIORITY_STYLES}
          onChange={(v) => onChange({ ...filters, priority: v as TaskPriority | "all" })}
          options={[
            { value: "all",    label: "Priority" },
            { value: "high",   label: "High"     },
            { value: "medium", label: "Medium"   },
            { value: "low",    label: "Low"      },
          ]}
        />

        <MemberFilter selected={filters.members} onChange={(ids) => onChange({ ...filters, members: ids })} />

        <SmartSearch
          value={localSearch}
          onChange={setLocalSearch}
          filteredCount={filteredCount}
          totalCount={totalCount}
          isFiltered={hasActive}
          tasks={tasks}
        />

        {hasActive && (
          <button
            onClick={resetAll}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition border"
            style={{
              color: "var(--cd-danger)",
              backgroundColor: "var(--cd-danger-subtle)",
              borderColor: "var(--cd-danger-subtle)",
            }}
          >
            <X size={11} /> Reset
          </button>
        )}
      </div>

      {/* Count context row */}
      <div className="px-6 sm:px-10 pb-4 flex items-center gap-2 flex-wrap">
        <span className="text-[11px]" style={{ color: "var(--cd-text-muted)" }}>
          Showing{" "}
          <span className="font-semibold" style={{ color: "var(--cd-text)" }}>{filteredCount}</span>
          {filteredCount !== totalCount && (
            <>
              {" "}of{" "}
              <span className="font-semibold" style={{ color: "var(--cd-text)" }}>{totalCount}</span>
            </>
          )}{" "}
          task{filteredCount !== 1 ? "s" : ""}
          {hasActive && (
            <span style={{ color: "var(--cd-primary)" }} className="font-semibold"> · filtered</span>
          )}
        </span>
        {localSearch && filteredCount === 0 && (
          <span className="text-[11px] font-medium" style={{ color: "var(--cd-danger)" }}>
            No results for "{localSearch}" — try technology name, member, or status
          </span>
        )}
        {localSearch && filteredCount > 0 && (
          <span className="text-[11px] font-medium" style={{ color: "var(--cd-primary)" }}>
            Searching across title, description, tech tags, members &amp; more
          </span>
        )}
      </div>
    </div>
  );
}
