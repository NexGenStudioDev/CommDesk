import { useTheme } from "@/theme";

interface Props {
  title: string;
  value: number | string;
  color?: "green" | "red" | "blue" | "yellow" | "purple";
}

export default function SummaryCard({ title, value, color = "blue" }: Props) {
  const { theme } = useTheme();

  const colorMap = {
    green: { border: theme.success.default, text: theme.success.default },
    red: { border: theme.danger.default, text: theme.danger.default },
    blue: { border: theme.primary.default, text: theme.primary.default },
    yellow: { border: theme.warning.default, text: theme.warning.default },
    purple: { border: theme.secondary.default, text: theme.secondary.default },
  };

  const c = colorMap[color];

  return (
    <div
      className="cd-card cd-card-hover flex items-center gap-4 border-l-4"
      style={{ borderLeftColor: c.border }}
    >
      <div>
        <p className="text-sm" style={{ color: theme.text.secondary }}>
          {title}
        </p>
        <h2 className="text-2xl font-bold" style={{ color: c.text }}>
          {value}
        </h2>
      </div>
    </div>
  );
}
