interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* 🌈 Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-yellow-50" />

      {/* ✨ Glow Effects */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-20" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 bg-yellow-200 rounded-full blur-3xl opacity-20" />

      {/* 📦 Content Wrapper */}
      <div className="relative w-full flex justify-center">
        {/* 📏 Max Width Container */}
        <main className="w-full max-w-[1400px] flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 md:py-6">
          {/* 🚀 FORCE FULL WIDTH CONTENT */}
          <div className="w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
