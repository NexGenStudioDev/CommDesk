type TechChipProps = {
  label: string;
};

const getChipStyles = (label: string) => {
  const normalized = label.toLowerCase();
  
  if (normalized.includes("react") || normalized.includes("next")) {
    return "from-blue-500/10 to-indigo-500/10 text-blue-400 border-blue-500/20 hover:border-blue-500/40 hover:shadow-blue-500/10";
  }
  if (normalized.includes("node") || normalized.includes("mongo") || normalized.includes("express")) {
    return "from-emerald-500/10 to-teal-500/10 text-emerald-400 border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-emerald-500/10";
  }
  if (normalized.includes("typescript") || normalized.includes("ts") || normalized.includes("tailwind")) {
    return "from-cyan-500/10 to-blue-500/10 text-cyan-400 border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-cyan-500/10";
  }
  if (normalized.includes("python") || normalized.includes("django") || normalized.includes("flask")) {
    return "from-indigo-500/10 to-purple-500/10 text-indigo-400 border-indigo-500/20 hover:border-indigo-500/40 hover:shadow-indigo-500/10";
  }
  if (normalized.includes("aws") || normalized.includes("docker") || normalized.includes("kubernetes")) {
    return "from-purple-500/10 to-pink-500/10 text-purple-400 border-purple-500/20 hover:border-purple-500/40 hover:shadow-purple-500/10";
  }

  // Default color cycle based on string hash
  const colors = [
    "from-indigo-500/10 to-blue-500/10 text-indigo-400 border-indigo-500/20 hover:border-indigo-500/40 hover:shadow-indigo-500/10",
    "from-cyan-500/10 to-emerald-500/10 text-cyan-400 border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-cyan-500/10",
    "from-emerald-500/10 to-teal-500/10 text-emerald-400 border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-emerald-500/10",
    "from-purple-500/10 to-indigo-500/10 text-purple-400 border-purple-500/20 hover:border-purple-500/40 hover:shadow-purple-500/10",
    "from-blue-500/10 to-cyan-500/10 text-blue-400 border-blue-500/20 hover:border-blue-500/40 hover:shadow-blue-500/10",
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
    <div
      className={`
        relative overflow-hidden
        px-4 py-2 rounded-full border
        text-xs font-semibold tracking-wide
        bg-gradient-to-br ${styles}
        shadow-sm backdrop-blur-sm
        flex items-center justify-center
        transition-all duration-200 hover:scale-[1.03]
        cursor-default
      `}
    >
      <div className="relative z-10">{label}</div>
      <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity" />
    </div>
  );
}

