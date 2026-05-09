import { useState } from "react";

interface AvatarProps {
  name: string;
  src: string;
  role?: string;
  size?: "xs" | "sm" | "md" | "lg";
  showTooltip?: boolean;
  status?: "online" | "offline" | "busy" | null;
  ring?: boolean;
  ringColor?: string;
}

// Color map for initials fallback — derived from name char code
const BG_COLORS = [
  "bg-indigo-500", "bg-pink-500", "bg-orange-500",
  "bg-emerald-500", "bg-sky-500", "bg-violet-500",
  "bg-rose-500",   "bg-amber-500","bg-teal-500",
];

function getColor(name: string): string {
  const code = name.charCodeAt(0) + (name.charCodeAt(1) ?? 0);
  return BG_COLORS[code % BG_COLORS.length];
}

function getInitials(name: string): string {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

const SIZE_MAP = {
  xs: { outer: "w-6 h-6",   text: "text-[9px]",  dot: "w-1.5 h-1.5 -right-0 -bottom-0",   ring: "ring-1" },
  sm: { outer: "w-7 h-7",   text: "text-[10px]", dot: "w-2 h-2 -right-0 -bottom-0",        ring: "ring-2" },
  md: { outer: "w-9 h-9",   text: "text-xs",     dot: "w-2.5 h-2.5 right-0 bottom-0",      ring: "ring-2" },
  lg: { outer: "w-12 h-12", text: "text-sm",     dot: "w-3 h-3 right-0.5 bottom-0.5",      ring: "ring-2" },
};

const STATUS_COLOR = {
  online:  "bg-emerald-400",
  offline: "bg-gray-300",
  busy:    "bg-red-400",
};

export default function Avatar({
  name, src, role, size = "sm",
  showTooltip = true, status = null, ring = false, ringColor = "ring-white",
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered]   = useState(false);
  const sz = SIZE_MAP[size];
  const initials = getInitials(name);
  const bgColor  = getColor(name);

  return (
    <div
      className="relative inline-flex shrink-0 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar circle */}
      <div className={`
        ${sz.outer} rounded-full overflow-hidden
        ${ring ? `${sz.ring} ${ringColor}` : ""}
        shadow-sm transition-transform duration-150
        ${showTooltip ? "group-hover:scale-110 group-hover:shadow-md cursor-pointer" : ""}
      `}>
        {!imgError ? (
          <img
            src={src}
            alt={name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          /* Initials fallback */
          <div className={`w-full h-full flex items-center justify-center font-bold ${sz.text} text-white ${bgColor}`}>
            {initials}
          </div>
        )}
      </div>

      {/* Status dot */}
      {status && (
        <span className={`absolute ${sz.dot} rounded-full border-2 border-white ${STATUS_COLOR[status]}`} />
      )}

      {/* Tooltip */}
      {showTooltip && hovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[9999] pointer-events-none">
          <div className="bg-gray-900 text-white rounded-xl px-3 py-2 shadow-2xl whitespace-nowrap">
            <p className="text-xs font-bold leading-tight">{name}</p>
            {role && <p className="text-[10px] text-gray-400 mt-0.5">{role}</p>}
          </div>
          {/* Arrow */}
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-gray-900 rotate-45 -mt-1 rounded-sm" />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Avatar group (stacked, with +N overflow) ─────────────────────────────────
interface AvatarGroupProps {
  members: { id: string; name: string; avatar: string; role?: string }[];
  max?: number;
  size?: "xs" | "sm" | "md";
}

export function AvatarGroup({ members, max = 3, size = "sm" }: AvatarGroupProps) {
  const visible  = members.slice(0, max);
  const overflow = members.length - max;
  const sz = SIZE_MAP[size];

  return (
    <div className="flex -space-x-2 items-center">
      {visible.map((m) => (
        <Avatar
          key={m.id}
          name={m.name}
          src={m.avatar}
          role={m.role}
          size={size}
          ring
          ringColor="ring-white"
          showTooltip
        />
      ))}
      {overflow > 0 && (
        <div className={`
          ${sz.outer} rounded-full bg-gray-100 border-2 border-white
          flex items-center justify-center shadow-sm z-10
          ring-2 ring-white
        `}>
          <span className={`${sz.text} font-bold text-gray-500`}>+{overflow}</span>
        </div>
      )}
    </div>
  );
}