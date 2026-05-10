const statusConfig: Record<string, { bg: string; color: string }> = {
  Active: { bg: "var(--cd-success-subtle)", color: "var(--cd-success)" },
  Inactive: { bg: "var(--cd-surface-2)", color: "var(--cd-text-2)" },
  Pending: { bg: "var(--cd-warning-subtle)", color: "var(--cd-warning)" },
  "On Boarding": { bg: "var(--cd-warning-subtle)", color: "var(--cd-warning)" },
  Banned: { bg: "var(--cd-danger-subtle)", color: "var(--cd-danger)" },
  Suspended: { bg: "var(--cd-danger-subtle)", color: "var(--cd-danger)" },
  Flagged: { bg: "var(--cd-warning-subtle)", color: "var(--cd-warning)" },
  "Under Review": { bg: "var(--cd-primary-subtle)", color: "var(--cd-primary-text)" },
  Draft: { bg: "var(--cd-surface-2)", color: "var(--cd-text-2)" },
  Submitted: { bg: "var(--cd-primary-subtle)", color: "var(--cd-primary-text)" },
  Approved: { bg: "var(--cd-success-subtle)", color: "var(--cd-success)" },
  Rejected: { bg: "var(--cd-danger-subtle)", color: "var(--cd-danger)" },
};

const StatusChip = ({ status }: { status: string }) => {
  const cfg = statusConfig[status] ?? {
    bg: "var(--cd-surface-2)",
    color: "var(--cd-text-2)",
  };

  return (
    <span className="cd-badge" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
      {status}
    </span>
  );
};

export default StatusChip;
