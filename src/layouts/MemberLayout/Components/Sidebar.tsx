import { PanelLeftClose, PanelLeftOpen, LogOut } from "lucide-react";

import NavItem from "./NavItem";

import { sidebarItems } from "@/config/sidebar.config";

import { useSidebar } from "@/context/SidebarContext";

export default function Sidebar() {
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <aside
      className={`
        hidden lg:flex flex-col

        min-h-screen

        border-r

        border-gray-200/70
        dark:border-white/10

        bg-white/80
        dark:bg-[#0B0F19]/90

        backdrop-blur-2xl

        px-3 py-5

        transition-all duration-500 ease-in-out

        shadow-sm

        relative z-30

        ${collapsed ? "w-[88px]" : "w-[288px]"}
      `}
    >
      {/* Top */}
      <div
        className={`
          flex

          mb-8

          ${collapsed ? "flex-col items-center" : "items-center justify-between"}
        `}
      >
        {/* Logo Section */}
        <div
          className={`
            flex items-center

            ${collapsed ? "justify-center" : "gap-3"}
          `}
        >
          {/* Logo */}
          <img
            src="/logoWithoutText.png"
            alt="CommDesk Logo"
            className={`
              object-contain

              transition-all duration-500 ease-in-out

              ${collapsed ? "w-10 h-10" : "w-14 h-14"}
            `}
          />

          {/* Text */}
          <div
            className={`
    transition-all duration-300 ease-in-out

    ${
      collapsed
        ? "opacity-0 -translate-x-2 absolute pointer-events-none"
        : "opacity-100 translate-x-0"
    }
  `}
          >
            <h1
              className="
      text-2xl font-black

      tracking-tight

      text-gray-900
      dark:text-white

      whitespace-nowrap
    "
            >
              CommDesk
            </h1>

            <p
              className="
      text-xs mt-1

      text-gray-500
      dark:text-zinc-400

      whitespace-nowrap
    "
            >
              Member Workspace
            </p>
          </div>
        </div>

        {/* Collapse Button */}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="
              p-2.5 rounded-xl

              bg-gray-100
              dark:bg-zinc-800

              hover:bg-gray-200
              dark:hover:bg-zinc-700

              text-gray-700
              dark:text-zinc-300

              transition-all duration-200
            "
          >
            <PanelLeftClose size={18} />
          </button>
        )}

        {/* Expand Button */}
        {collapsed && (
          <div className="flex justify-center mt-3">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="
                p-2 rounded-xl

                bg-gray-100
                dark:bg-zinc-800

                hover:bg-gray-200
                dark:hover:bg-zinc-700

                text-gray-700
                dark:text-zinc-300

                transition-all duration-200
              "
            >
              <PanelLeftOpen size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav
        className="
          flex-1

          space-y-2

          overflow-y-auto

          pr-1
        "
      >
        {sidebarItems.map((item) => (
          <NavItem key={item.path} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Bottom */}
      <div
        className="
          pt-5 mt-5

          border-t

          border-gray-200
          dark:border-white/10
        "
      >
        <button
          className="
            w-full

            flex items-center
            justify-center

            gap-3

            px-3 py-3

            rounded-2xl

            bg-red-50
            dark:bg-red-500/10

            text-red-500
            dark:text-red-400

            hover:bg-red-100
            dark:hover:bg-red-500/20

            transition-all duration-200
          "
        >
          <LogOut size={18} />

          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
