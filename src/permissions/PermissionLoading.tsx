type PermissionLoadingProps = {
  title?: string;
  description?: string;
};

const PermissionLoading = ({
  title = "Checking access",
  description = "We are validating your permissions and preparing the right actions for this screen.",
}: PermissionLoadingProps) => {
  return (
    <div className="flex w-full justify-center p-6 sm:p-10">
      <div
        className="w-full max-w-3xl rounded-3xl p-8 sm:p-10 text-center"
        style={{
          background:
            "linear-gradient(145deg, var(--cd-surface), color-mix(in srgb, var(--cd-primary) 5%, var(--cd-surface)))",
          border: "1px solid var(--cd-border)",
          boxShadow: "0 18px 50px var(--cd-shadow)",
        }}
      >
        <div className="mx-auto h-11 w-11 animate-pulse rounded-2xl bg-[var(--cd-primary-subtle)]" />
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

export default PermissionLoading;
