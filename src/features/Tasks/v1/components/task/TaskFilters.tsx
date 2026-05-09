import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Search, X, SlidersHorizontal, ChevronDown, Check, Sparkles } from "lucide-react";
import { mockMembers } from "../../mock/taskMockData";
import type { TaskFilters, TaskStatus, TaskPriority } from "../../Task.types";

interface Props {
  filters: TaskFilters; onChange: (f: TaskFilters) => void;
  totalCount: number; filteredCount: number;
}

const STATUS_COLORS:   Record<string,string> = { all:"",todo:"bg-gray-600 text-white","in-progress":"bg-indigo-600 text-white",completed:"bg-emerald-500 text-white" };
const TIME_COLORS:     Record<string,string> = { all:"",upcoming:"bg-sky-500 text-white",past:"bg-red-500 text-white",completed:"bg-emerald-500 text-white" };
const PRIORITY_COLORS: Record<string,string> = { all:"",high:"bg-red-500 text-white",medium:"bg-amber-500 text-white",low:"bg-sky-400 text-white" };
const STATUS_DOTS:     Record<string,string> = { all:"bg-gray-300",todo:"bg-gray-500","in-progress":"bg-indigo-500",completed:"bg-emerald-500" };
const TIME_DOTS:       Record<string,string> = { all:"bg-gray-300",upcoming:"bg-sky-500",past:"bg-red-500",completed:"bg-emerald-500" };
const PRIORITY_DOTS:   Record<string,string> = { all:"bg-gray-300",high:"bg-red-500",medium:"bg-amber-400",low:"bg-sky-400" };

// ─── Shared dropdown hook ─────────────────────────────────────────────────────
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
  btnRef: React.RefObject<HTMLButtonElement>; panelRef: React.RefObject<HTMLDivElement>;
  open: boolean; children: React.ReactNode;
}) {
  const [style, setStyle] = useState<React.CSSProperties>({});
  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom;
    if (below < 240 && rect.top > below)
      setStyle({ position:"fixed", left:rect.left, bottom:window.innerHeight - rect.top + 6, zIndex:9999 });
    else
      setStyle({ position:"fixed", left:rect.left, top:rect.bottom + 6, zIndex:9999 });
  }, [open, btnRef]);
  if (!open) return null;
  return createPortal(
    <div ref={panelRef} style={style}
      className="bg-white rounded-xl border border-gray-200 shadow-2xl shadow-gray-200/80 py-1 overflow-hidden min-w-[150px]">
      {children}
    </div>,
    document.body
  );
}

// ─── Pill dropdown ────────────────────────────────────────────────────────────
function PillDropdown<T extends string>({ value, options, onChange, colorMap, dotMap }: {
  value:T; options:{value:T;label:string}[]; onChange:(v:T)=>void;
  colorMap:Record<string,string>; dotMap:Record<string,string>;
}) {
  const { open, setOpen, btnRef, panelRef } = useDropdown();
  const isActive = value !== options[0].value;
  const label = options.find(o => o.value === value)?.label ?? options[0].label;
  return (
    <div className="relative shrink-0">
      <button ref={btnRef} onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap select-none
          ${isActive ? `${colorMap[value]} border-transparent shadow-sm` : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
        {label}
        <ChevronDown size={11} className={`transition-transform duration-200 ${open?"rotate-180":""} ${!isActive?"text-gray-400":"opacity-70"}`}/>
      </button>
      <DropdownPortal btnRef={btnRef} panelRef={panelRef} open={open}>
        {options.map(opt => (
          <button key={opt.value}
            onMouseDown={(e) => { e.preventDefault(); onChange(opt.value); setOpen(false); }}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-left transition-colors
              ${opt.value===value?"bg-gray-50 text-gray-900":"text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
            <span className={`w-2 h-2 rounded-full shrink-0 ${dotMap[opt.value]??"bg-gray-300"}`}/>
            <span className="flex-1">{opt.label}</span>
            {opt.value===value && <Check size={12} className="text-indigo-500 shrink-0"/>}
          </button>
        ))}
      </DropdownPortal>
    </div>
  );
}

// ─── Member filter ────────────────────────────────────────────────────────────
function MemberFilter({ selected, onChange }: { selected:string[]; onChange:(ids:string[])=>void }) {
  const { open, setOpen, btnRef, panelRef } = useDropdown();
  const isActive = selected.length > 0;
  const toggle = (id:string) => onChange(selected.includes(id) ? selected.filter(x=>x!==id) : [...selected,id]);
  return (
    <div className="relative shrink-0">
      <button ref={btnRef} onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all select-none
          ${isActive ? "bg-violet-600 text-white border-transparent shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
        {isActive && (
          <span className="flex -space-x-1.5">
            {selected.slice(0,2).map(id => { const m=mockMembers.find(x=>x.id===id);
              return m ? <img key={id} src={m.avatar} alt={m.name} className="w-4 h-4 rounded-full border border-violet-400 object-cover"/> : null; })}
          </span>
        )}
        {isActive ? `${selected.length} Member${selected.length>1?"s":""}` : "Members"}
        <ChevronDown size={11} className={`transition-transform duration-200 ${open?"rotate-180":""} ${!isActive?"text-gray-400":""}`}/>
      </button>
      <DropdownPortal btnRef={btnRef} panelRef={panelRef} open={open}>
        {mockMembers.map(m => { const isSel=selected.includes(m.id); return (
          <button key={m.id} onMouseDown={(e)=>{e.preventDefault();toggle(m.id);}}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-gray-50 ${isSel?"bg-violet-50":""}`}>
            <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full object-cover shrink-0"/>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold truncate ${isSel?"text-violet-700":"text-gray-900"}`}>{m.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{m.role}</p>
            </div>
            {isSel && <div className="w-4 h-4 rounded-full bg-violet-600 flex items-center justify-center shrink-0"><Check size={9} className="text-white"/></div>}
          </button>
        );})}
        {isActive && (<><div className="border-t my-1"/>
          <button onMouseDown={(e)=>{e.preventDefault();onChange([]);}} className="w-full px-3 py-1.5 text-xs text-red-500 font-semibold text-left hover:bg-red-50">Clear all</button></>)}
      </DropdownPortal>
    </div>
  );
}

// ─── Smart search input ───────────────────────────────────────────────────────
function SmartSearch({ value, onChange, filteredCount, totalCount, isFiltered }: {
  value: string; onChange: (v:string) => void;
  filteredCount: number; totalCount: number; isFiltered: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Show hint popup briefly on focus when empty
  useEffect(() => {
    if (focused && !value) {
      setShowHint(true);
      const t = setTimeout(() => setShowHint(false), 3000);
      return () => clearTimeout(t);
    } else {
      setShowHint(false);
    }
  }, [focused, value]);

  const hasResults = !value || filteredCount > 0;

  return (
    <div className="relative shrink-0">
      <div className={`flex items-center gap-1.5 pl-2.5 pr-2 py-1.5 rounded-full border transition-all
        ${focused
          ? "border-indigo-400 ring-2 ring-indigo-100 bg-white w-52 sm:w-64"
          : value
          ? "border-indigo-300 bg-indigo-50 w-44 sm:w-52"
          : "border-gray-200 bg-gray-50 hover:border-gray-300 w-36 sm:w-44"}`}>

        <Search size={13} className={`shrink-0 transition-colors ${focused || value ? "text-indigo-500" : "text-gray-400"}`}/>

        <input
          ref={inputRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search tasks…"
          className="flex-1 text-xs bg-transparent outline-none placeholder-gray-400 text-gray-800 min-w-0"
        />

        {/* Result count badge while typing */}
        {value && (
          <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors
            ${hasResults ? "bg-indigo-100 text-indigo-600" : "bg-red-100 text-red-500"}`}>
            {filteredCount}
          </span>
        )}

        {value && (
          <button onClick={() => onChange("")} className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={12}/>
          </button>
        )}
      </div>

      {/* Hint tooltip — opens BELOW the search input via portal */}
      {showHint && inputRef.current && (() => {
        const rect = inputRef.current.getBoundingClientRect();
        return createPortal(
          <div style={{ position:"fixed", left: rect.left, top: rect.bottom + 8, zIndex:9999, width:288 }}
            className="bg-gray-900 text-white rounded-xl p-3 shadow-2xl">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={12} className="text-indigo-400"/>
              <span className="text-[11px] font-bold text-indigo-300">Smart Search</span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              {[
                ["React","technology"],["Arjun","member name"],
                ["high","priority"],["completed","status"],
                ["mandatory","flag"],["github","submit type"],
              ].map(([ex, desc]) => (
                <button key={ex} onMouseDown={(e) => { e.preventDefault(); onChange(ex); setShowHint(false); }}
                  className="flex items-center gap-1.5 text-left hover:bg-white/10 rounded-lg px-1.5 py-1 transition-colors group">
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-300/10 px-1.5 py-0.5 rounded-md group-hover:bg-amber-300/20">
                    {ex}
                  </span>
                  <span className="text-[10px] text-gray-400">{desc}</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 mt-2">Click any example to try it</p>
          {/* Arrow pointing UP toward the search box */}
          <div className="absolute -top-1.5 left-5 w-3 h-3 bg-gray-900 rotate-45 rounded-sm"/>
          </div>,
          document.body
        );
      })()}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function TaskFiltersBar({ filters, onChange, totalCount, filteredCount }: Props) {
  const [localSearch, setLocalSearch] = useState(filters.search);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onChange({ ...filters, search: localSearch }), 300);
    return () => clearTimeout(debounceRef.current);
  }, [localSearch]); // eslint-disable-line

  const hasActive = filters.status !== "all" || filters.priority !== "all" || filters.time !== "all" || filters.members.length > 0 || filters.search !== "";
  const resetAll  = () => { setLocalSearch(""); onChange({ status:"all", priority:"all", time:"all", members:[], search:"" }); };

  return (
    <div className="border-b bg-white">
      <div className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto scrollbar-hide">
        <SlidersHorizontal size={14} className="text-gray-400 shrink-0"/>

        <PillDropdown<TaskStatus|"all"> value={filters.status} colorMap={STATUS_COLORS} dotMap={STATUS_DOTS}
          onChange={v => onChange({...filters,status:v})}
          options={[{value:"all",label:"Status"},{value:"todo",label:"Todo"},{value:"in-progress",label:"In Progress"},{value:"completed",label:"Completed"}]}/>

        <PillDropdown<"all"|"upcoming"|"past"|"completed"> value={filters.time} colorMap={TIME_COLORS} dotMap={TIME_DOTS}
          onChange={v => onChange({...filters,time:v})}
          options={[{value:"all",label:"Time"},{value:"upcoming",label:"Upcoming"},{value:"past",label:"Past"},{value:"completed",label:"Completed"}]}/>

        <PillDropdown<TaskPriority|"all"> value={filters.priority} colorMap={PRIORITY_COLORS} dotMap={PRIORITY_DOTS}
          onChange={v => onChange({...filters,priority:v as TaskPriority|"all"})}
          options={[{value:"all",label:"Priority"},{value:"high",label:"High"},{value:"medium",label:"Medium"},{value:"low",label:"Low"}]}/>

        <MemberFilter selected={filters.members} onChange={ids => onChange({...filters,members:ids})}/>

        <div className="w-3 shrink-0"/>

        <SmartSearch
          value={localSearch}
          onChange={setLocalSearch}
          filteredCount={filteredCount}
          totalCount={totalCount}
          isFiltered={hasActive}
        />

        {hasActive && (
          <button onClick={resetAll}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 transition shrink-0">
            <X size={11}/> Reset
          </button>
        )}
      </div>

      {/* Count + search context */}
      <div className="px-4 pb-2 flex items-center gap-2 flex-wrap">
        <span className="text-[11px] text-gray-400">
          Showing <span className="font-semibold text-gray-700">{filteredCount}</span>
          {filteredCount !== totalCount && <> of <span className="font-semibold text-gray-700">{totalCount}</span></>}{" "}
          task{filteredCount !== 1 ? "s" : ""}
          {hasActive && <span className="text-indigo-500 font-semibold"> · filtered</span>}
        </span>
        {localSearch && filteredCount === 0 && (
          <span className="text-[11px] text-red-500 font-medium">
            No results for "{localSearch}" — try technology name, member, or status
          </span>
        )}
        {localSearch && filteredCount > 0 && (
          <span className="text-[11px] text-indigo-500 font-medium">
            Searching across title, description, tech tags, members & more
          </span>
        )}
      </div>
    </div>
  );
}