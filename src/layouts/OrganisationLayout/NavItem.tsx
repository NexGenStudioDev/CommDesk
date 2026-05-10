import { NavLink } from "react-router-dom";

import { SidebarItem } from "./layout.types";

interface Props {
  item: SidebarItem;
  collapsed?: boolean;
}

export default function NavItem({ item, collapsed }: Props) {
  const Icon = item.icon;

  return (
    <NavLink to={item.path}>
      {({ isActive }) => (
        <div
          className={`
            relative group

            rounded-2xl

            overflow-visible

            transition-all duration-300 ease-in-out

            ${
              isActive
                ? `
                  bg-indigo-100/90
                  dark:bg-indigo-500/15

                  border border-indigo-200
                  dark:border-indigo-500/20

                  shadow-[0_0_25px_rgba(99,102,241,0.12)]
                `
                : `
                  border border-transparent

                  hover:bg-gray-100
                  dark:hover:bg-white/5
                `
            }
          `}
        >
          {/* Tooltip */}
          {collapsed && (
            <div
              className="
                absolute left-[calc(100%+12px)] top-1/2

                -translate-y-1/2

                px-3 py-2

                rounded-xl

                bg-gray-900
                dark:bg-zinc-800

                text-white

                text-xs font-medium

                whitespace-nowrap

                opacity-0
                invisible

                group-hover:opacity-100
                group-hover:visible

                transition-all duration-200

                shadow-lg

                z-50
              "
            >
              {item.title}

              {/* Tooltip Arrow */}
              <div
                className="
                  absolute left-[-5px] top-1/2

                  -translate-y-1/2

                  w-2.5 h-2.5

                  rotate-45

                  bg-gray-900
                  dark:bg-zinc-800
                "
              />
            </div>
          )}

          {/* Active Glow */}
          {isActive && (
            <div
              className="
                absolute inset-0

                bg-gradient-to-r

                from-indigo-500/5
                to-transparent

                pointer-events-none
              "
            />
          )}

          {/* Active Indicator */}
          {isActive && (
            <div
              className="
                absolute left-0 top-2 bottom-2

                w-1 rounded-full

                bg-indigo-500
              "
            />
          )}

          {/* Content */}
          <div
            className={`
              relative z-10

              flex items-center

              transition-all duration-300 ease-in-out

              ${collapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"}
            `}
          >
            {/* Icon */}
            <div
              className={`
                shrink-0

                transition-all duration-300

                ${
                  isActive
                    ? `
                      text-indigo-700
                      dark:text-indigo-300

                      scale-110
                    `
                    : `
                      text-gray-700
                      dark:text-zinc-400

                      group-hover:text-black
                      dark:group-hover:text-white
                    `
                }
              `}
            >
              <Icon size={18} />
            </div>

            {/* Label */}
            <div
              className={`
                overflow-hidden

                transition-all duration-300 ease-in-out

                ${
                  collapsed
                    ? `
                      w-0
                      opacity-0
                    `
                    : `
                      w-auto
                      opacity-100
                    `
                }
              `}
            >
              <span
                className={`
                  whitespace-nowrap

                  text-sm font-medium

                  transition-all duration-300

                  ${
                    isActive
                      ? `
                        text-indigo-600
                        dark:text-indigo-400
                      `
                      : `
                        text-gray-700
                        dark:text-zinc-400

                        group-hover:text-black
                        dark:group-hover:text-white
                      `
                  }
                `}
              >
                {item.title}
              </span>
            </div>
          </div>
        </div>
      )}
    </NavLink>
  );
}
