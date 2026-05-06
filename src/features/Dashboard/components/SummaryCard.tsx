interface Props {
  title: string;
  value: number | string;
  color?: "green" | "red" | "blue" | "yellow" | "purple";
}

const borderMap = {
  green: "border-l-[var(--cd-success)]",
  red: "border-l-[var(--cd-danger)]",
  blue: "border-l-[var(--cd-primary)]",
  yellow: "border-l-[var(--cd-warning)]",
  purple: "border-l-[var(--cd-secondary)]",
};

const textMap = {
  green: "var(--cd-success)",
  red: "var(--cd-danger)",
  blue: "var(--cd-primary)",
  yellow: "var(--cd-warning)",
  purple: "var(--cd-secondary)",
};

export default function SummaryCard({ title, value, color = "blue" }: Props) {
  return (
    <div
      className={`cd-card cd-card-hover flex items-center gap-4 border-l-4 ${borderMap[color]}`}
    >
      <div>
        <p className="text-sm" style={{ color: "var(--cd-text-2)" }}>
          {title}
        </p>
        <h2 className="text-2xl font-bold" style={{ color: textMap[color] }}>
          {value}
        </h2>
      </div>
    </div>
  );
}
