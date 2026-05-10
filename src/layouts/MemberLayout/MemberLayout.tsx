import { Outlet } from "react-router-dom";

import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import MobileSidebar from "./Components/MobileSidebar";

export default function MemberLayout() {
  return (
    <div
      className="
        relative

        min-h-screen
        w-full

        flex

        overflow-hidden

        bg-gray-50
        dark:bg-[#0a0a0a]

        text-gray-900
        dark:text-white

        transition-colors duration-300
      "
    >
      {/* Background Gradient */}
      <div
        className="
          absolute inset-0

          bg-gradient-to-br

          from-indigo-50
          via-white
          to-yellow-50

          dark:from-[#0f172a]
          dark:via-[#09090b]
          dark:to-[#111827]
        "
      />

      {/* Top Glow */}
      <div
        className="
          pointer-events-none

          absolute -top-40 -left-40

          w-[28rem]
          h-[28rem]

          rounded-full

          bg-indigo-300/20
          dark:bg-indigo-500/10

          blur-3xl
        "
      />

      {/* Bottom Glow */}
      <div
        className="
          pointer-events-none

          absolute bottom-0 right-0

          w-[28rem]
          h-[28rem]

          rounded-full

          bg-yellow-300/20
          dark:bg-yellow-500/10

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

          bg-cyan-500/5

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
        <Header />

        {/* Page Content */}
        <main
          className="
            flex-1
            overflow-y-auto

            w-full

            px-4
            sm:px-6
            lg:px-8
            xl:px-10

            py-4
            sm:py-5
            lg:py-6
          "
        >
          <div
            className="
              w-full

              max-w-[1450px]

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
  );
}
