import RoleChip from "@/features/Member/v1/Components/RoleChip";
import PermissionChip from "./PermissionChip";
import { PermissionMember } from "../mock/permissionData";

const MemberPermissionCard = ({ member }: { member: PermissionMember }) => {
  return (
    <div
      className="w-full flex flex-col gap-4 p-5 rounded-2xl border"
      style={{
        backgroundColor: "var(--cd-surface)",
        borderColor: "var(--cd-border)",
      }}
    >
      {/* Top — avatar, name, role, email */}
      <div className="flex items-center gap-4">
        <img
          src={member.image}
          alt={member.name}
          className="w-14 h-14 rounded-full object-cover"
        />
        <div className="flex flex-col gap-1">
          <h3
            className="text-sm font-bold"
            style={{ color: "var(--cd-text)" }}
          >
            {member.name}
          </h3>
          <p
            className="text-xs"
            style={{ color: "var(--cd-text-2)" }}
          >
            {member.email}
          </p>
          <RoleChip role={member.role} />
        </div>

        {/* Status badge — top right */}
        <div className="ml-auto">
          <span
            className="text-xs px-3 py-1 rounded-full font-medium"
            style={{
              backgroundColor:
                member.status === "Active"
                  ? "var(--cd-success-subtle)"
                  : "var(--cd-surface-2)",
              color:
                member.status === "Active"
                  ? "var(--cd-success)"
                  : "var(--cd-text-muted)",
            }}
          >
            {member.status}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div
        className="w-full h-px"
        style={{ backgroundColor: "var(--cd-border)" }}
      />

      {/* Permissions */}
      <div className="flex flex-col gap-2">
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--cd-text-muted)" }}
        >
          Permissions
        </p>
        <div className="flex flex-wrap gap-2">
          {member.permissions.map((perm) => (
            <PermissionChip
              key={perm.label}
              label={perm.label}
              granted={perm.granted}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberPermissionCard;