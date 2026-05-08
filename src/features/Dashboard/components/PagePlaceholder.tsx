interface Props {
  title: string;
  description?: string;
}

export default function PagePlaceholder({ title, description }: Props) {
  return (
    <div
      className="
        rounded-3xl

        border

        border-gray-200
        dark:border-white/10

        bg-white/70
        dark:bg-white/5

        backdrop-blur-xl

        p-10

        min-h-[400px]

        flex flex-col
        items-center
        justify-center

        text-center
      "
    >
      <h1
        className="
          text-3xl font-bold

          text-gray-900
          dark:text-white
        "
      >
        {title}
      </h1>

      <p
        className="
          mt-3

          text-sm

          text-gray-500
          dark:text-zinc-400

          max-w-md
        "
      >
        {description || `${title} module is currently under development.`}
      </p>
    </div>
  );
}
