import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Search, CalendarDays, Loader2, X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useEvents } from "../../hooks/useEvents";
import { EVENT_TYPE_CONFIG, EVENT_STATUS_CONFIG, SELECTED_EVENT_KEY } from "../../constants/task.constants";
import type { EventOption } from "../../Task.types";

interface Props {
  selectedEventId: string | null;
  onSelect: (id: string | null) => void;
}

export default function EventDropdown({ selectedEventId, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const { data: events = [], isLoading } = useEvents();
  const selectedEvent = events.find((e) => e.id === selectedEventId) ?? null;

  const filtered = events.filter(
    (event) =>
      query.trim() === "" ||
      event.name.toLowerCase().includes(query.toLowerCase()) ||
      event.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = useCallback(
    (event: EventOption) => {
      localStorage.setItem(SELECTED_EVENT_KEY, event.id);
      onSelect(event.id);
      setOpen(false);
      setQuery("");
      setHighlighted(0);
    },
    [onSelect]
  );

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    localStorage.removeItem(SELECTED_EVENT_KEY);
    onSelect(null);
  };

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    setTimeout(() => searchRef.current?.focus(), 80);
  }, [open]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!open) {
      if (event.key === "Enter" || event.key === " ") setOpen(true);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted((value) => Math.min(value + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted((value) => Math.max(value - 1, 0));
    } else if (event.key === "Enter") {
      if (filtered[highlighted]) handleSelect(filtered[highlighted]);
    } else if (event.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  };

  useEffect(() => {
    const el = listRef.current?.children[highlighted] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [highlighted]);

  return (
    <div ref={containerRef} className="relative w-full max-w-[432px] sm:w-[432px] shrink-0" onKeyDown={handleKeyDown}>
      <button
        onClick={() => {
          setHighlighted(0);
          setOpen((value) => !value);
        }}
        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all"
        style={{
          backgroundColor: "var(--cd-surface)",
          borderColor: open ? "var(--cd-primary)" : "var(--cd-border)",
          boxShadow: open ? "0 0 0 3px var(--cd-primary-subtle)" : "none",
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {isLoading ? (
          <Loader2 size={15} className="animate-spin shrink-0" style={{ color: "var(--cd-text-muted)" }} />
        ) : (
          <CalendarDays size={15} className="shrink-0" style={{ color: "var(--cd-primary)" }} />
        )}

        <span className="flex-1 text-left truncate">
          {isLoading ? (
            <span style={{ color: "var(--cd-text-muted)" }}>Loading events...</span>
          ) : selectedEvent ? (
            <span className="flex items-center gap-2">
              <span className="font-semibold truncate" style={{ color: "var(--cd-text)" }}>
                {selectedEvent.name}
              </span>
              {(() => {
                const cfg = EVENT_TYPE_CONFIG[selectedEvent.type];
                return (
                  <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${cfg.bg} ${cfg.text}`}>
                    {cfg.label}
                  </span>
                );
              })()}
            </span>
          ) : (
            <span style={{ color: "var(--cd-text-muted)" }}>Select an event...</span>
          )}
        </span>

        <div className="flex items-center gap-1 shrink-0">
          {selectedEvent && !isLoading && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(event) => event.key === "Enter" && handleClear(event as unknown as React.MouseEvent)}
              className="p-0.5 rounded transition"
              style={{ color: "var(--cd-text-muted)" }}
              aria-label="Clear selection"
            >
              <X size={13} />
            </span>
          )}
          <ChevronDown
            size={15}
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            style={{ color: "var(--cd-text-muted)" }}
          />
        </div>
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-1.5 w-full sm:w-[420px] rounded-xl border shadow-xl z-50 overflow-hidden"
          style={{
            backgroundColor: "var(--cd-surface)",
            borderColor: "var(--cd-border)",
            boxShadow: "0 8px 24px var(--cd-shadow-md)",
          }}
        >
          <div className="flex items-center gap-2 px-3 py-2.5 border-b" style={{ borderColor: "var(--cd-border)" }}>
            <Search size={14} className="shrink-0" style={{ color: "var(--cd-text-muted)" }} />
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setHighlighted(0);
              }}
              placeholder="Search events..."
              className="flex-1 text-sm outline-none bg-transparent"
              style={{ color: "var(--cd-text)" }}
            />
            {query && (
              <button onClick={() => setQuery("")} style={{ color: "var(--cd-text-muted)" }}>
                <X size={13} />
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm" style={{ color: "var(--cd-text-muted)" }}>
                No events match "{query}"
              </p>
            </div>
          ) : (
            <ul ref={listRef} role="listbox" className="max-h-64 overflow-y-auto py-1.5">
              {filtered.map((event, index) => {
                const typeCfg = EVENT_TYPE_CONFIG[event.type];
                const statusCfg = EVENT_STATUS_CONFIG[event.status];
                const isActive = event.id === selectedEventId;
                const isHighlighted = index === highlighted;

                return (
                  <li
                    key={event.id}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => handleSelect(event)}
                    onMouseEnter={(mouseEvent) => {
                      setHighlighted(index);
                      (mouseEvent.currentTarget as HTMLLIElement).style.backgroundColor = "var(--cd-primary-subtle)";
                    }}
                    onMouseLeave={(mouseEvent) => {
                      (mouseEvent.currentTarget as HTMLLIElement).style.backgroundColor = isActive
                        ? "var(--cd-primary-subtle)"
                        : "transparent";
                    }}
                    className="flex items-start gap-3 px-3 py-3 cursor-pointer transition-colors"
                    style={{
                      backgroundColor: isActive || isHighlighted ? "var(--cd-primary-subtle)" : "transparent",
                    }}
                  >
                    <div className={`w-1 self-stretch rounded-full mt-0.5 ${typeCfg.dot}`} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="text-sm font-semibold truncate"
                          style={{ color: isActive ? "var(--cd-primary-text)" : "var(--cd-text)" }}
                        >
                          {event.name}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${typeCfg.bg} ${typeCfg.text}`}>
                          {typeCfg.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-xs truncate" style={{ color: "var(--cd-text-muted)" }}>
                          {event.subtitle}
                        </span>
                        <span style={{ color: "var(--cd-border)" }}>·</span>
                        <span className="text-[10px] shrink-0" style={{ color: "var(--cd-text-muted)" }}>
                          {format(parseISO(event.startDate), "MMM d")} - {format(parseISO(event.endDate), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>

                    <span className={`shrink-0 flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full ${statusCfg.bg} ${statusCfg.text}`}>
                      {statusCfg.pulse ? (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusCfg.dot}`} />
                          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${statusCfg.dot}`} />
                        </span>
                      ) : (
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                      )}
                      {event.status}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="border-t px-3 py-2 flex items-center justify-between gap-3" style={{ borderColor: "var(--cd-border)" }}>
            <span className="text-[10px]" style={{ color: "var(--cd-text-muted)" }}>
              {filtered.length} event{filtered.length !== 1 ? "s" : ""}
            </span>
            <span className="text-[10px] hidden sm:inline" style={{ color: "var(--cd-text-muted)" }}>
              Use arrows, Enter, Esc
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
