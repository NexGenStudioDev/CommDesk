interface Props {
  title: string;
  value: number | string;
  color?: "green" | "red" | "blue" | "yellow" | "purple";
}

const colorMap = {
  green: {
    text: "text-green-600",
    border: "border-green-500",
    bg: "bg-green-50",
  },
  red: {
    text: "text-red-600",
    border: "border-red-500",
    bg: "bg-red-50",
  },
  blue: {
    text: "text-blue-600",
    border: "border-blue-500",
    bg: "bg-blue-50",
  },
  yellow: {
    text: "text-yellow-600",
    border: "border-yellow-500",
    bg: "bg-yellow-50",
  },
  purple: {
    text: "text-purple-600",
    border: "border-purple-500",
    bg: "bg-purple-50",
  },
};

export default function SummaryCard({ title, value, color = "blue" }: Props) {
  const styles = colorMap[color];

  return (
    <div
      className={`
        relative
        flex items-center gap-4
        p-5
        rounded-2xl
        bg-white
        shadow-sm hover:shadow-md
        transition
        border-l-4 ${styles.border}
      `}
    >
      {/* Content */}
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className={`text-2xl font-bold ${styles.text}`}>{value}</h2>
      </div>
    </div>
  );
}
