import { Bell, Search, Menu, ChevronDown } from "lucide-react";
import { useDashboardData } from "../../features/member/hooks/useDashboardData";

import { useSidebar } from "@/context/SidebarContext";

import ThemeToggle from "../../features/member/components/ThemeToggle";
import { useLocation } from "react-router";

export default function Header() {
  const { setOpen } = useSidebar();
  const location = useLocation();

  const { data } = useDashboardData();

  const getPageTitle = () => {
    const path = location.pathname.split("/").pop();

    if (!path || path === "member") return "Dashboard";

    return path
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <header
      className="
        sticky top-0 z-30

        border-b

        border-gray-200/70
        dark:border-white/10

        bg-white/75
        dark:bg-[#0B0F19]/80

        backdrop-blur-2xl

        transition-all duration-300
      "
    >
      <div
        className="
          h-16

          px-4
          sm:px-6

          flex items-center justify-between

          gap-4
        "
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu */}
          <button
            className="
              lg:hidden

              p-2 rounded-xl

              bg-gray-100
              dark:bg-zinc-800

              hover:bg-gray-200
              dark:hover:bg-zinc-700

              text-gray-700
              dark:text-zinc-300

              transition-all duration-200
            "
            onClick={() => setOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Title */}
          <div>
            <h2
              className="
                text-lg font-semibold

                tracking-tight

                text-gray-900
                dark:text-zinc-100
              "
            >
              {getPageTitle()}
            </h2>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div
            className="
              hidden md:flex items-center gap-2

              min-w-[220px]

              rounded-2xl

              border

              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-white/5

              px-3 py-2

              shadow-sm
              dark:shadow-none

              transition-all duration-200

              focus-within:border-indigo-400
              dark:focus-within:border-indigo-500
            "
          >
            <Search
              size={16}
              className="
                text-gray-500
                dark:text-zinc-500
              "
            />

            <input
              placeholder="Search..."
              className="
                w-full

                bg-transparent

                outline-none

                text-sm

                text-gray-900
                dark:text-white

                placeholder:text-gray-500
                dark:placeholder:text-zinc-500
              "
            />
          </div>

          {/* Notifications */}
          <button
            className="
              relative

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
            <Bell size={18} />

            {/* Notification Dot */}
            <span
              className="
                absolute top-2 right-2

                w-2 h-2

                rounded-full

                bg-red-500
              "
            />
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Profile */}
          <button
            className="
              flex items-center gap-2

              rounded-2xl

              border

              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-white/5

              px-2 py-1.5

              hover:bg-gray-50
              dark:hover:bg-white/10

              transition-all duration-200
            "
          >
            {/* Avatar */}
            <div
              className="
                w-9 h-9

                rounded-full

                bg-indigo-100
                dark:bg-indigo-500/20

                flex items-center justify-center

                font-semibold

                text-indigo-600
                dark:text-indigo-300
              "
            >
              {data?.user.name.charAt(0).toUpperCase() || "U"}
            </div>

            {/* User Info */}
            <div className="hidden sm:block text-left">
              <p
                className="
                  text-sm font-medium

                  text-gray-900
                  dark:text-white
                "
              >
                {data?.user.name.split(" ")[0] || "User"}
              </p>

              <p
                className="
                  text-xs

                  text-gray-500
                  dark:text-zinc-400
                "
              >
                Member
              </p>
            </div>

            <ChevronDown
              size={16}
              className="
                hidden sm:block

                text-gray-500
                dark:text-zinc-400
              "
            />
          </button>
        </div>
      </div>
    </header>
  );
}
