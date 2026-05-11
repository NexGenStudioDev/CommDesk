type PermissionChipProps = {
  label: string;
  granted: boolean;
};

const PermissionChip = ({ label, granted }: PermissionChipProps) => {
  return (
    <span
      className="text-xs px-2 py-1 rounded-full font-medium"
      style={{
        backgroundColor: granted
          ? "var(--cd-success-subtle)"
          : "var(--cd-danger-subtle)",
        color: granted
          ? "var(--cd-success)"
          : "var(--cd-danger)",
      }}
    >
      {label}
    </span>
  );
};

export default PermissionChip;