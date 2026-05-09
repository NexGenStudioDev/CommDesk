import { BsThreeDotsVertical } from "react-icons/bs";
import { FaCertificate } from "react-icons/fa";
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
            <th>Actions</th>
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
                <FaCertificate
                  className="inline mr-1.5"
                  style={{ color: "var(--cd-warning)" }}
                />
                {member.certificates}
              </td>
              <td>
                <button
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: "var(--cd-text-2)" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "var(--cd-hover)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")
                  }
                >
                  <BsThreeDotsVertical />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberTable;
