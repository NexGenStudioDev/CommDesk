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

  // Filter events by query
  const filtered = events.filter((e) =>
    query.trim() === "" ||
    e.name.toLowerCase().includes(query.toLowerCase()) ||
    e.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  // Persist selection
  const handleSelect = useCallback(
    (evt: EventOption) => {
      localStorage.setItem(SELECTED_EVENT_KEY, evt.id);
      onSelect(evt.id);
      setOpen(false);
      setQuery("");
      setHighlighted(0);
    },
    [onSelect]
  );

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.removeItem(SELECTED_EVENT_KEY);
    onSelect(null);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search on open
  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 80);
      setHighlighted(0);
    }
  }, [open]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " ") setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (filtered[highlighted]) handleSelect(filtered[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  };

  // Scroll highlighted item into view
  useEffect(() => {
    const el = listRef.current?.children[highlighted] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [highlighted]);

  return (
    <div ref={containerRef} className="relative w-72 shrink-0" onKeyDown={handleKeyDown}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`
          w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all
          ${open
            ? "border-indigo-400 ring-2 ring-indigo-100 bg-white"
            : "border-gray-200 bg-white hover:border-gray-300"}
        `}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {isLoading ? (
          <Loader2 size={15} className="text-gray-400 animate-spin shrink-0" />
        ) : (
          <CalendarDays size={15} className="text-indigo-500 shrink-0" />
        )}

        <span className="flex-1 text-left truncate">
          {isLoading ? (
            <span className="text-gray-400">Loading events…</span>
          ) : selectedEvent ? (
            <span className="flex items-center gap-2">
              <span className="text-gray-900 font-semibold truncate">{selectedEvent.name}</span>
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
            <span className="text-gray-400">Select an event…</span>
          )}
        </span>

        <div className="flex items-center gap-1 shrink-0">
          {selectedEvent && !isLoading && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => e.key === "Enter" && handleClear(e as unknown as React.MouseEvent)}
              className="p-0.5 rounded text-gray-300 hover:text-gray-500 transition"
              aria-label="Clear selection"
            >
              <X size={13} />
            </span>
          )}
          <ChevronDown
            size={15}
            className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-[340px] bg-white rounded-2xl border border-gray-200 shadow-xl shadow-gray-100/80 z-50 overflow-hidden">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-b">
            <Search size={14} className="text-gray-400 shrink-0" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setHighlighted(0); }}
              placeholder="Search events…"
              className="flex-1 text-sm outline-none placeholder-gray-400 text-gray-900 bg-transparent"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600">
                <X size={13} />
              </button>
            )}
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-400">No events match "{query}"</p>
            </div>
          ) : (
            <ul ref={listRef} role="listbox" className="max-h-64 overflow-y-auto py-1.5">
              {filtered.map((evt, i) => {
                const typeCfg   = EVENT_TYPE_CONFIG[evt.type];
                const statusCfg = EVENT_STATUS_CONFIG[evt.status];
                const isActive  = evt.id === selectedEventId;
                const isHl      = i === highlighted;

                return (
                  <li
                    key={evt.id}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => handleSelect(evt)}
                    onMouseEnter={() => setHighlighted(i)}
                    className={`
                      flex items-start gap-3 px-3 py-3 cursor-pointer transition-colors
                      ${isHl ? "bg-indigo-50" : "hover:bg-gray-50"}
                      ${isActive ? "bg-indigo-50/70" : ""}
                    `}
                  >
                    {/* Type color bar */}
                    <div className={`w-1 self-stretch rounded-full mt-0.5 ${typeCfg.dot}`} />

                    <div className="flex-1 min-w-0">
                      {/* Event name + type badge */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-semibold truncate ${isActive ? "text-indigo-700" : "text-gray-900"}`}>
                          {evt.name}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${typeCfg.bg} ${typeCfg.text}`}>
                          {typeCfg.label}
                        </span>
                      </div>

                      {/* Subtitle + dates */}
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-xs text-gray-400 truncate">{evt.subtitle}</span>
                        <span className="text-gray-200">·</span>
                        <span className="text-[10px] text-gray-400 shrink-0">
                          {format(parseISO(evt.startDate), "MMM d")} – {format(parseISO(evt.endDate), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>

                    {/* Status chip */}
                    <span className={`shrink-0 flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full ${statusCfg.bg} ${statusCfg.text}`}>
                      {statusCfg.pulse ? (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusCfg.dot}`} />
                          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${statusCfg.dot}`} />
                        </span>
                      ) : (
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                      )}
                      {evt.status}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Footer */}
          <div className="border-t px-3 py-2 flex items-center justify-between">
            <span className="text-[10px] text-gray-400">{filtered.length} event{filtered.length !== 1 ? "s" : ""}</span>
            <span className="text-[10px] text-gray-400">↑↓ navigate · Enter select · Esc close</span>
          </div>
        </div>
      )}
    </div>
  );
}