import { Trophy, Flame, Star, Award } from "lucide-react";

import { AchievementsData } from "@/features/Dashboard/types/dashboard";

interface Props {
  data: AchievementsData;
}

const iconMap = {
  trophy: <Trophy size={20} />,
  flame: <Flame size={20} />,
  star: <Star size={20} />,
  award: <Award size={20} />,
};

export default function Achievements({ data }: Props) {
  const { badges = [], certificates = [] } = data || {};

  return (
    <div className="card hover:shadow-md transition">
      <h3 className="section-title">Achievements</h3>

      {/* Badges */}
      <div className="mb-5">
        <p className="text-xs text-gray-500 mb-3">Badges</p>

        {badges.length === 0 ? (
          <p className="text-gray-400 text-sm">No badges yet</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {badges.map((b, i) => (
              <div
                key={i}
                className="
                  p-3 rounded-xl
                  bg-gradient-to-br from-indigo-50 to-indigo-100
                  hover:shadow-md hover:scale-[1.03]
                  transition-all duration-200
                  flex items-center gap-3
                "
              >
                {/* Icon */}
                <div className="text-indigo-600">{iconMap[b.icon]}</div>

                {/* Text */}
                <div>
                  <p className="text-sm font-semibold text-indigo-700">{b.title}</p>
                  <p className="text-xs text-gray-500">Earned</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certificates */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Certificates</p>

        {certificates.map((c, i) => (
          <div key={i} className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
            <p className="text-sm font-medium text-gray-800">{c.title}</p>
            <p className="text-xs text-gray-400">{c.issuer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
