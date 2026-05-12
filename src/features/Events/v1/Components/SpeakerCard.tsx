import React, { memo, useState } from "react";

type SpeakerCardProps = {
  image: string;
  name: string;
  role: string;
};

const SpeakerCard = ({ image, name, role }: SpeakerCardProps) => {
  const [hasImageError, setHasImageError] = useState(false);

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <article className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-blue-50">
        {hasImageError || !image ? (
          <div className="flex h-full w-full items-center justify-center text-sm font-bold text-[#306ee8]">
            {initials || "SP"}
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
        <p className="truncate text-sm font-medium uppercase tracking-wide text-gray-500">{role}</p>
      </div>
    </article>
  );
};

export default memo(SpeakerCard);
