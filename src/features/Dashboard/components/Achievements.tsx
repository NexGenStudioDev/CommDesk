import { Trophy, Flame, Star, Award } from "lucide-react";
import { AchievementsData } from "../Member/v1/Type/dashboard";

interface Props {
  data: AchievementsData;
}

const iconMap = {
  trophy: <Trophy size={18} />,
  flame: <Flame size={18} />,
  star: <Star size={18} />,
  award: <Award size={18} />,
};

export default function Achievements({ data }: Props) {
  const { badges = [], certificates = [] } = data || {};

  return (
    <div className="cd-card cd-card-hover">
      <h3 className="cd-section-title">Achievements</h3>

      <div className="mb-5">
        <p className="text-xs font-semibold mb-3" style={{ color: "var(--cd-text-2)" }}>
          Badges
        </p>
        {badges.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--cd-text-muted)" }}>
            No badges yet
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {badges.map((b, i) => (
              <div
                key={i}
                className="p-3 rounded-xl flex items-center gap-3 hover:scale-[1.03] transition-all duration-200 cursor-pointer"
                style={{ backgroundColor: "var(--cd-primary-subtle)" }}
              >
                <div style={{ color: "var(--cd-primary)" }}>{iconMap[b.icon]}</div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--cd-primary-text)" }}>
                    {b.title}
                  </p>
                  <p className="text-xs" style={{ color: "var(--cd-text-muted)" }}>
                    Earned
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="text-xs font-semibold mb-2" style={{ color: "var(--cd-text-2)" }}>
          Certificates
        </p>
        {certificates.map((c, i) => (
          <div
            key={i}
            className="p-2.5 rounded-xl mb-1.5 transition-colors"
            style={{ backgroundColor: "var(--cd-surface-2)" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--cd-hover)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--cd-surface-2)")
            }
          >
            <p className="text-sm font-medium" style={{ color: "var(--cd-text)" }}>
              {c.title}
            </p>
            <p className="text-xs" style={{ color: "var(--cd-text-muted)" }}>
              {c.issuer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
