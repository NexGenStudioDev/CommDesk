import { FaCertificate } from "react-icons/fa";
import { Member_Permissions, usePermissionMap } from "@/permissions";
import RoleChip from "./RoleChip";
import StatusChip from "./StatusChip";

type MemberTableProps = {
  members: Array<{
    name: string;
    image?: string;
    role: string;
    status: string;
    skills: string;
    certificates: string;
  }>;
};

const MemberTable = ({ members }: MemberTableProps) => {
  const { canEdit, canDelete } = usePermissionMap({
    canEdit: Member_Permissions.UPDATE_MEMBER,
    canDelete: Member_Permissions.DELETE_MEMBER,
  });
  const canManageMembers = canEdit || canDelete;

  return (
    <div
      className="w-[90%] mt-4 rounded-2xl overflow-hidden"
      style={{ border: "1px solid var(--cd-border)" }}
    >
      <table className="cd-table">
        <thead>
          <tr>
            <th>Member Name</th>
            <th>Role</th>
            <th>Status</th>
            <th>Skills</th>
            <th>Certificates</th>
            {canManageMembers && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={index}>
              <td className="font-medium">
                {member.image && (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-9 h-9 rounded-xl mr-3 inline-block object-cover"
                  />
                )}
                <span style={{ color: "var(--cd-text)" }}>{member.name}</span>
              </td>
              <td>
                <RoleChip role={member.role} />
              </td>
              <td>
                <StatusChip status={member.status} />
              </td>
              <td style={{ color: "var(--cd-text-2)" }}>{member.skills}</td>
              <td style={{ color: "var(--cd-text-2)" }}>
                <FaCertificate className="inline mr-1.5" style={{ color: "var(--cd-warning)" }} />
                {member.certificates}
              </td>
              {canManageMembers && (
                <td>
                  <div className="flex items-center gap-2">
                    {canEdit && (
                      <button className="cd-btn cd-btn-secondary px-3 py-1 text-xs">Edit</button>
                    )}
                    {canDelete && (
                      <button className="cd-btn cd-btn-danger px-3 py-1 text-xs">Delete</button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberTable;
