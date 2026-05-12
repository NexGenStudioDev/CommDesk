import type { CSSProperties } from "react";

const ACCENTS = ["#0284c7", "#4f46e5", "#0f766e", "#7c3aed", "#b45309", "#be123c"];

function accentFor(id: string) {
  const code = id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return ACCENTS[code % ACCENTS.length];
}

export function techBadgeStyle(id: string): CSSProperties {
  const accent = accentFor(id);

  return {
    backgroundColor: `color-mix(in srgb, ${accent} 8%, var(--cd-surface))`,
    borderColor: `color-mix(in srgb, ${accent} 18%, var(--cd-border-subtle))`,
    color: `color-mix(in srgb, ${accent} 62%, var(--cd-text))`,
  };
}
