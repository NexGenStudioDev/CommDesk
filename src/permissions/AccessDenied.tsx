type AccessDeniedProps = {
  title: string;
  description: string;
};

const AccessDenied = ({ title, description }: AccessDeniedProps) => {
  return (
    <div className="flex w-full justify-center p-6 sm:p-10">
      <div
        className="w-full max-w-3xl rounded-3xl p-8 sm:p-10 text-center"
        style={{
          background:
            "linear-gradient(145deg, var(--cd-surface), color-mix(in srgb, var(--cd-primary) 7%, var(--cd-surface)))",
          border: "1px solid var(--cd-border)",
          boxShadow: "0 18px 50px var(--cd-shadow)",
        }}
      >
        <span
          className="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]"
          style={{
            backgroundColor: "var(--cd-primary-subtle)",
            color: "var(--cd-primary-text)",
          }}
        >
          Permission required
        </span>
        <h2 className="mt-5 text-2xl font-bold" style={{ color: "var(--cd-text)" }}>
          {title}
        </h2>
        <p className="mt-3 text-sm sm:text-base" style={{ color: "var(--cd-text-2)" }}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default AccessDenied;
