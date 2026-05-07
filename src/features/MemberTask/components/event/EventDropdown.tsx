import { MdEvent, MdExpandMore } from "react-icons/md";
import type { Event } from "../../types/task.types";

interface Props {
  events: Event[];
  selectedEventId: string | null;
  onChange: (id: string) => void;
}

export default function EventDropdown({ events, selectedEventId, onChange }: Props) {
  const selected = events.find((e) => e.id === selectedEventId);

  return (
    <div className="relative inline-flex items-center gap-2">
      <MdEvent className="text-[#306ee8] text-lg shrink-0" />
      <div className="relative">
        <select
          value={selectedEventId ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm font-medium text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#306ee8]/30 focus:border-[#306ee8] transition-colors"
        >
          <option value="" disabled>
            Select Event
          </option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.name}
            </option>
          ))}
        </select>
        <MdExpandMore className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
      {selected && (
        <span className="text-xs text-gray-400 hidden sm:inline">— {selected.name}</span>
      )}
    </div>
  );
}
