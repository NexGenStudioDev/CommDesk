import React, { memo } from "react";

type MentorCardProps = {
  image: string;
  name: string;
  role: string;
};

const MentorCard = ({ image, name, role }: MentorCardProps) => {
  const [hasImageError, setHasImageError] = React.useState(false);

  React.useEffect(() => {
    setHasImageError(false);
  }, [image]);

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <article className="flex items-center justify-between gap-3 rounded-lg border border-emerald-100 bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex min-w-0 items-center gap-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-emerald-200 bg-emerald-50">
          {hasImageError || !image ? (
            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-emerald-700">
              {initials || "MN"}
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

      <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
        Mentor
      </span>
    </article>
  );
};

export default memo(MentorCard);
