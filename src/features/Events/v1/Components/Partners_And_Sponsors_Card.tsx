import React, { memo } from "react";
import { CATEGORY_ACCENT_RULES, CategoryAccent, DEFAULT_ACCENT } from "../Constants/Event.constant";

type PartnersAndSponsorsCardProps = {
  image?: string;
  name?: string;
  category?: string;
};

const getCategoryAccent = (category: string): CategoryAccent => {
  const normalizedCategory = category
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ");

  if (!normalizedCategory) {
    return DEFAULT_ACCENT;
  }

  const matchedRule = CATEGORY_ACCENT_RULES.find((rule) =>
    rule.keywords.some((keyword) => normalizedCategory.includes(keyword)),
  );

  return matchedRule?.accent ?? DEFAULT_ACCENT;
};

const Partners_And_Sponsors_Card = ({
  image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSi4ADHBRtirkyHFguw_y74rbz2-vVUGWUnmQ&s",
  name = "Partner/Sponsor Name",
  category = "Official Partner",
}: PartnersAndSponsorsCardProps) => {
  // key={image} on the parent resets this state when image changes
  const [hasImageError, setHasImageError] = React.useState(false);

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const accent = getCategoryAccent(category);

  return (
    <article
      className="group relative flex min-h-52.5 w-full flex-col overflow-hidden rounded-xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{
        background: "var(--cd-surface)",
        borderColor: "var(--cd-border)",
      }}
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${accent.stripe}`} />

      <span
        className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${accent.badge}`}
      >
        {category}
      </span>

      <div className="mt-4 flex flex-1 flex-col items-center justify-center text-center">
        <div
          className={`flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm ring-4 ${accent.logoRing}`}
        >
          {hasImageError || !image ? (
            <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-100 text-base font-bold text-gray-600">
              {initials || "PS"}
            </div>
          ) : (
            <img
              src={image}
              alt={`${name} logo`}
              className="max-h-full max-w-full object-contain"
              loading="lazy"
              onError={() => setHasImageError(true)}
            />
          )}
        </div>

        <h3 className="mt-3 text-sm font-semibold leading-tight text-gray-800 sm:text-base">
          {name}
        </h3>
      </div>
    </article>
  );
};

export default memo(Partners_And_Sponsors_Card);
