import { X } from "lucide-react";

import { sidebarItems } from "@/config/sidebar.config";

import NavItem from "./NavItem";

import { useSidebar } from "@/context/SidebarContext";

export default function MobileSidebar() {
  const { open, setOpen } = useSidebar();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`
          fixed inset-0 z-40

          bg-black/50
          backdrop-blur-sm

          transition-all duration-300

          lg:hidden

          ${open ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      />

      {/* Drawer */}
      <aside
        className={`
          fixed top-0 left-0 z-50

          h-screen
          w-72

          border-r

          border-gray-200/70
          dark:border-white/10

          bg-white/90
          dark:bg-[#0B0F19]/95

          backdrop-blur-2xl

          p-5

          transition-all duration-300 ease-in-out

          shadow-2xl

          lg:hidden

          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Top */}
        <div
          className="
            flex items-center justify-between

            mb-8
          "
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/logoWithoutText.png"
              alt="CommDesk Logo"
              className="
                w-12 h-12

                object-contain
              "
            />

            <div>
              <h1
                className="
                  text-2xl font-black

                  tracking-tight

                  text-gray-900
                  dark:text-white
                "
              >
                CommDesk
              </h1>

              <p
                className="
                  text-xs mt-1

                  text-gray-500
                  dark:text-zinc-400
                "
              >
                Member Workspace
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
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
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav
          className="
            space-y-2

            overflow-y-auto
          "
        >
          {sidebarItems.map((item) => (
            <div key={item.path} onClick={() => setOpen(false)}>
              <NavItem item={item} />
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
