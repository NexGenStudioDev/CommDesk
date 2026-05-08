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
    <div
      className="
        bg-white dark:bg-zinc-900
        border border-gray-200 dark:border-zinc-800
        rounded-2xl
        p-5
        shadow-sm dark:shadow-none
        hover:shadow-md dark:hover:border-zinc-700
        transition-all duration-300
      "
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Achievements</h3>

      {/* Badges */}
      <div className="mb-6">
        <p className="text-xs font-medium text-gray-500 dark:text-zinc-400 mb-3">Badges</p>

        {badges.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-zinc-500">No badges yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badges.map((b, i) => (
              <div
                key={i}
                className="
                  p-3 rounded-xl
                  bg-gradient-to-br
                  from-indigo-50 to-indigo-100

                  dark:from-indigo-500/10
                  dark:to-indigo-500/5

                  border border-indigo-100
                  dark:border-indigo-500/10

                  hover:shadow-md
                  hover:scale-[1.02]

                  transition-all duration-200

                  flex items-center gap-3
                "
              >
                {/* Icon */}
                <div className="text-indigo-600 dark:text-indigo-400">{iconMap[b.icon]}</div>

                {/* Text */}
                <div>
                  <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                    {b.title}
                  </p>

                  <p className="text-xs text-gray-500 dark:text-zinc-400">Earned</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certificates */}
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-zinc-400 mb-3">Certificates</p>

        <div className="space-y-2">
          {certificates.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-zinc-500">No certificates yet</p>
          ) : (
            certificates.map((c, i) => (
              <div
                key={i}
                className="
                  p-3 rounded-xl

                  bg-gray-50
                  dark:bg-zinc-800/50

                  border border-gray-100
                  dark:border-zinc-700

                  hover:bg-gray-100
                  dark:hover:bg-zinc-800

                  transition-all duration-200
                "
              >
                <p className="text-sm font-medium text-gray-800 dark:text-white">{c.title}</p>

                <p className="text-xs text-gray-500 dark:text-zinc-400">{c.issuer}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
