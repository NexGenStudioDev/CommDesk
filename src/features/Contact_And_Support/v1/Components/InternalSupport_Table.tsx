import { useState } from "react";
import { FiMail, FiCopy, FiCheck } from "react-icons/fi";

type TeamMember = {
  id: number;
  name: string;
  department: string;
  role: string;
  email: string;
  status: "active" | "away" | "offline";
};

const MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: "John Doe",
    department: "IT",
    role: "System Admin",
    email: "john.doe@example.com",
    status: "active",
  },
  {
    id: 2,
    name: "Jane Smith",
    department: "HR",
    role: "HR Manager",
    email: "jane.smith@example.com",
    status: "active",
  },
  {
    id: 3,
    name: "Alex Turner",
    department: "Finance",
    role: "Finance Lead",
    email: "alex.turner@example.com",
    status: "away",
  },
  {
    id: 4,
    name: "Maria Garcia",
    department: "Design",
    role: "UI/UX Designer",
    email: "maria.garcia@example.com",
    status: "active",
  },
  {
    id: 5,
    name: "Chris Wilson",
    department: "DevOps",
    role: "Infrastructure",
    email: "chris.wilson@example.com",
    status: "offline",
  },
];

const STATUS_COLOR: Record<TeamMember["status"], string> = {
  active: "var(--cd-success)",
  away: "var(--cd-warning)",
  offline: "var(--cd-text-muted)",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const CopyEmailButton = ({ email }: { email: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handleCopy}
      title="Copy email"
      className="p-1.5 rounded-md transition-colors"
      style={{ color: "var(--cd-text-muted)" }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--cd-hover)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")
      }
    >
      {copied ? <FiCheck size={14} style={{ color: "var(--cd-success)" }} /> : <FiCopy size={14} />}
    </button>
  );
};

const InternalSupport_Table = () => {
  return (
    <div className="w-full h-fit overflow-x-auto">
      <table className="cd-table min-w-[680px]">
        <thead>
          <tr>
            <th>Team Member</th>
            <th>Role / Department</th>
            <th>Email Address</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {MEMBERS.map((member) => (
            <tr key={member.id}>
              <td>
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white select-none"
                      style={{ backgroundColor: "var(--cd-primary)" }}
                    >
                      {getInitials(member.name)}
                    </div>
                    <span
                      className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
                      style={{
                        backgroundColor: STATUS_COLOR[member.status],
                        borderColor: "var(--cd-surface)",
                      }}
                    />
                  </div>
                  <span className="font-medium text-sm" style={{ color: "var(--cd-text)" }}>
                    {member.name}
                  </span>
                </div>
              </td>
              <td>
                <span
                  className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                  style={{
                    backgroundColor: "var(--cd-surface-2)",
                    color: "var(--cd-text-2)",
                  }}
                >
                  {member.role}
                </span>
              </td>
              <td>
                <span className="text-xs break-all" style={{ color: "var(--cd-text-2)" }}>
                  {member.email}
                </span>
              </td>
              <td>
                <div className="flex items-center justify-center gap-1">
                  <a
                    href={`mailto:${member.email}`}
                    title="Send email"
                    className="p-1.5 rounded-md transition-colors"
                    style={{ color: "var(--cd-text-muted)" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                        "var(--cd-primary-subtle)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent")
                    }
                  >
                    <FiMail size={14} />
                  </a>
                  <CopyEmailButton email={member.email} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {MEMBERS.length === 0 && (
        <div className="py-16 text-center text-sm" style={{ color: "var(--cd-text-muted)" }}>
          No team members found.
        </div>
      )}
    </div>
  );
};

export default InternalSupport_Table;
