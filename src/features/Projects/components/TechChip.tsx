import { cn } from "@/lib/utils";

type TechChipProps = {
  label: string;
};

const getChipStyles = (label: string) => {
  const normalized = label.toLowerCase();
  
  if (normalized.includes("react") || normalized.includes("next")) {
    return {
      surface:
        "border-blue-400/20 bg-[linear-gradient(135deg,rgba(15,23,42,0.94),rgba(30,41,59,0.92),rgba(37,99,235,0.18))] text-blue-100 shadow-blue-950/30",
      glow: "from-blue-400/18 via-cyan-300/8 to-transparent",
      accent: "bg-blue-300/80",
    };
  }
  if (normalized.includes("node") || normalized.includes("mongo") || normalized.includes("express")) {
    return {
      surface:
        "border-emerald-400/20 bg-[linear-gradient(135deg,rgba(15,23,42,0.94),rgba(20,83,45,0.78),rgba(16,185,129,0.16))] text-emerald-100 shadow-emerald-950/30",
      glow: "from-emerald-300/18 via-teal-300/8 to-transparent",
      accent: "bg-emerald-300/80",
    };
  }
  if (normalized.includes("typescript") || normalized.includes("ts") || normalized.includes("tailwind")) {
    return {
      surface:
        "border-cyan-400/20 bg-[linear-gradient(135deg,rgba(15,23,42,0.94),rgba(14,116,144,0.78),rgba(59,130,246,0.18))] text-cyan-100 shadow-cyan-950/30",
      glow: "from-cyan-300/18 via-sky-300/8 to-transparent",
      accent: "bg-cyan-300/80",
    };
  }
  if (normalized.includes("python") || normalized.includes("django") || normalized.includes("flask")) {
    return {
      surface:
        "border-indigo-400/20 bg-[linear-gradient(135deg,rgba(15,23,42,0.94),rgba(49,46,129,0.8),rgba(129,140,248,0.16))] text-indigo-100 shadow-indigo-950/30",
      glow: "from-indigo-300/18 via-violet-300/8 to-transparent",
      accent: "bg-indigo-300/80",
    };
  }
  if (normalized.includes("aws") || normalized.includes("docker") || normalized.includes("kubernetes")) {
    return {
      surface:
        "border-purple-400/20 bg-[linear-gradient(135deg,rgba(15,23,42,0.94),rgba(88,28,135,0.78),rgba(168,85,247,0.16))] text-purple-100 shadow-purple-950/30",
      glow: "from-purple-300/18 via-fuchsia-300/8 to-transparent",
      accent: "bg-purple-300/80",
    };
  }

  // Default color cycle based on string hash
  const colors = [
    {
      surface:
        "border-indigo-400/20 bg-[linear-gradient(135deg,rgba(15,23,42,0.94),rgba(49,46,129,0.82),rgba(59,130,246,0.14))] text-indigo-100 shadow-indigo-950/30",
      glow: "from-indigo-300/18 via-blue-300/8 to-transparent",
      accent: "bg-indigo-300/80",
    },
    {
      surface:
        "border-cyan-400/20 bg-[linear-gradient(135deg,rgba(15,23,42,0.94),rgba(8,145,178,0.8),rgba(16,185,129,0.14))] text-cyan-100 shadow-cyan-950/30",
      glow: "from-cyan-300/18 via-emerald-300/8 to-transparent",
      accent: "bg-cyan-300/80",
    },
    {
      surface:
        "border-emerald-400/20 bg-[linear-gradient(135deg,rgba(15,23,42,0.94),rgba(20,83,45,0.8),rgba(45,212,191,0.14))] text-emerald-100 shadow-emerald-950/30",
      glow: "from-emerald-300/18 via-teal-300/8 to-transparent",
      accent: "bg-emerald-300/80",
    },
    {
      surface:
        "border-purple-400/20 bg-[linear-gradient(135deg,rgba(15,23,42,0.94),rgba(88,28,135,0.8),rgba(99,102,241,0.14))] text-purple-100 shadow-purple-950/30",
      glow: "from-purple-300/18 via-indigo-300/8 to-transparent",
      accent: "bg-purple-300/80",
    },
    {
      surface:
        "border-blue-400/20 bg-[linear-gradient(135deg,rgba(15,23,42,0.94),rgba(30,64,175,0.8),rgba(34,211,238,0.14))] text-blue-100 shadow-blue-950/30",
      glow: "from-blue-300/18 via-cyan-300/8 to-transparent",
      accent: "bg-blue-300/80",
    },
  ];
  
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export default function TechChip({ label }: TechChipProps) {
  const styles = getChipStyles(label);

  return (
    <span
      className={cn(
        "group/chip relative inline-flex max-w-full items-center gap-2 overflow-hidden rounded-full px-4 py-2 text-sm font-medium leading-5 tracking-[0.01em] backdrop-blur-md transition-all duration-200 hover:scale-[1.03] hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-18px_rgba(15,23,42,0.9)]",
        "border shadow-[0_10px_24px_-18px_rgba(15,23,42,0.95)]",
        styles.surface,
      )}
    >
      <span className={cn("relative z-10 h-2 w-2 shrink-0 rounded-full shadow-[0_0_16px_currentColor]", styles.accent)} />
      <span className="relative z-10 max-w-full break-words">{label}</span>
      <span className={cn("pointer-events-none absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-200 group-hover/chip:opacity-100", styles.glow)} />
      <span className="pointer-events-none absolute inset-[1px] rounded-full bg-white/[0.02]" />
    </span>
  );
}
