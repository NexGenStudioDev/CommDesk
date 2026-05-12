import React, { memo } from "react";

type JudgeCardProps = {
  image: string;
  name: string;
  role: string;
};

const JudgeCard = ({ image, name, role }: JudgeCardProps) => {
  // key={image} on the parent resets this state when image changes
  const [hasImageError, setHasImageError] = React.useState(false);

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <article className="flex items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex min-w-0 items-center gap-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-amber-200 bg-amber-50">
          {hasImageError || !image ? (
            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-amber-700">
              {initials || "JG"}
            </div>
          ) : (
            <img
              src={image}
              alt={`${name} profile`}
              className="h-full w-full object-cover"
              onError={() => setHasImageError(true)}
            />
          )}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-gray-800">{name}</h3>
          <p className="truncate text-sm font-medium uppercase tracking-wide text-gray-500">
            {role}
          </p>
        </div>
      </div>

      <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
        Judge
      </span>
    </article>
  );
};

export default memo(JudgeCard);
