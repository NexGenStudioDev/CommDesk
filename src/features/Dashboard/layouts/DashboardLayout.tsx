interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden cd-page">
      <div className="relative w-full flex justify-center">
        <main className="w-full max-w-[1400px] flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 md:py-6">
          <div className="w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
