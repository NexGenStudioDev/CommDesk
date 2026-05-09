const roleConfig: Record<string, { bg: string; color: string }> = {
  Mentor: { bg: "var(--cd-primary-subtle)", color: "var(--cd-primary-text)" },
  Mentee: { bg: "var(--cd-success-subtle)", color: "var(--cd-success)" },
  Admin: { bg: "var(--cd-danger-subtle)", color: "var(--cd-danger)" },
  Organizer: { bg: "var(--cd-warning-subtle)", color: "var(--cd-warning)" },
  Volunteer: { bg: "var(--cd-accentSubtle, var(--cd-primary-subtle))", color: "var(--cd-accent)" },
  Member: { bg: "var(--cd-surface-2)", color: "var(--cd-text-2)" },
};

const RoleChip = ({ role }: { role: string }) => {
  const cfg = roleConfig[role] ?? {
    bg: "var(--cd-surface-2)",
    color: "var(--cd-secondary)",
  };

  return (
    <span
      className="cd-badge"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      {role}
    </span>
  );
};

export default RoleChip;
