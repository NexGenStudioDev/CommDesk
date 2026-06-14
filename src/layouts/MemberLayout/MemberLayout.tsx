import { Outlet } from "react-router-dom";

import Sidebar from "./Components/Sidebar";
import MobileSidebar from "./Components/MobileSidebar";
import { SidebarProvider } from "@/context/SidebarContext";

export default function MemberLayout() {
  return (
    <SidebarProvider>
      <div
        className="
        relative

        min-h-screen
        w-full

        flex

        overflow-hidden

        bg-gray-50
  dark:bg-[#0b0d12]

        text-gray-900
        dark:text-white

        transition-colors duration-300
      "
      >
        {/* Background Gradient */}
        <div
          className="
          absolute inset-0

          bg-linear-to-br

          from-slate-50
          via-white
          to-cyan-50

          dark:from-[#0b0d12]
          dark:via-[#101522]
          dark:to-[#111827]
        "
        />

        {/* Top Glow */}
        <div
          className="
          pointer-events-none

          absolute -top-40 -left-40

          w-md
          h-112

          rounded-full

          bg-sky-300/20
          dark:bg-sky-500/10

          blur-3xl
        "
        />

        {/* Bottom Glow */}
        <div
          className="
          pointer-events-none

          absolute bottom-0 right-0

          w-md
          h-112

          rounded-full

          bg-cyan-300/20
          dark:bg-cyan-500/10

          blur-3xl
        "
        />

        {/* Extra Glow */}
        <div
          className="
          pointer-events-none

          absolute top-1/3 right-1/4

          w-80 h-80

          rounded-full

          bg-slate-500/5

          blur-3xl
        "
        />

        {/* Sidebar */}
        <div className="relative z-20">
          <Sidebar />
        </div>

        {/* Main Area */}
        <div
          className="
          relative z-10

          flex-1
          flex flex-col

          min-w-0
        "
        >
          {/* Header */}

          {/* Page Content */}
          <main
            className="
            flex-1
            overflow-y-auto

            w-full

        
          "
          >
            <div
              className="
              w-full

              mx-auto
            "
            >
              <Outlet />
            </div>
          </main>

          {/* Mobile Sidebar */}
          <MobileSidebar />
        </div>
      </div>
    </SidebarProvider>
  );
}
