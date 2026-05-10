interface Props {
  title: string;
  value: number | string;
  color?: "green" | "red" | "blue" | "yellow" | "purple";
}

const colorMap = {
  green: {
    text: "text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-500/30",
    bg: "bg-green-50 dark:bg-green-500/10",
  },

  red: {
    text: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-500/30",
    bg: "bg-red-50 dark:bg-red-500/10",
  },

  blue: {
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-500/30",
    bg: "bg-blue-50 dark:bg-blue-500/10",
  },

  yellow: {
    text: "text-yellow-600 dark:text-yellow-400",
    border: "border-yellow-200 dark:border-yellow-500/30",
    bg: "bg-yellow-50 dark:bg-yellow-500/10",
  },

  purple: {
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-500/30",
    bg: "bg-purple-50 dark:bg-purple-500/10",
  },
};

export default function SummaryCard({ title, value, color = "blue" }: Props) {
  const styles = colorMap[color];

  return (
    <div
      className={`
        relative

        overflow-hidden

        flex items-center gap-4

        p-5

        rounded-2xl

        border

        ${styles.border}

        ${styles.bg}

        shadow-sm
        hover:shadow-md

        transition-all duration-300

        hover:-translate-y-[2px]

        backdrop-blur-xl
      `}
    >
      {/* Glow */}
      <div
        className="
          absolute -top-8 -right-8

          w-24 h-24

          rounded-full

          bg-white/30
          dark:bg-white/5

          blur-2xl
        "
      />

      {/* Content */}
      <div className="relative z-10">
        <p
          className="
            text-sm font-medium

            text-gray-600
            dark:text-zinc-400
          "
        >
          {title}
        </p>

        <h2
          className={`
            text-3xl font-bold mt-1

            ${styles.text}
          `}
        >
          {value}
        </h2>
      </div>
    </div>
  );
}
