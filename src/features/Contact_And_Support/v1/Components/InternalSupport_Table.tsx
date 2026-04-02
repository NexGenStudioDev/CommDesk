import { getTheme } from "@/config/them.config";
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

const STATUS_DOT: Record<TeamMember["status"], string> = {
  active: "bg-green-400",
  away: "bg-yellow-400",
  offline: "bg-gray-300",
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
      className="p-1.5 rounded-md transition-colors hover:bg-gray-100 text-gray-400 hover:text-gray-600"
    >
      {copied ? <FiCheck size={14} className="text-green-500" /> : <FiCopy size={14} />}
    </button>
  );
};

const InternalSupport_Table = () => {
  const theme = getTheme("light");

  return (
    <div className="w-full h-fit overflow-x-auto">
      <table className="w-full min-w-[680px] border-collapse">
        <thead>
          <tr
            className="text-xs sm:text-sm font-semibold uppercase tracking-wider"
            style={{ background: theme.background.secondary, color: theme.textColor.secondary }}
          >
            <th className="text-left px-3 sm:px-5 py-3">Team Member</th>
            <th className="text-left px-3 sm:px-5 py-3">Role / Department</th>
            <th className="text-left px-3 sm:px-5 py-3">Email Address</th>
            <th className="text-center px-3 sm:px-5 py-3">Actions</th>
          </tr>
        </thead>

        <tbody style={{ background: theme.background.primary }}>
          {MEMBERS.map((member) => {
            return (
              <tr key={member.id} className="group transition-colors hover:bg-[#f8fafc]">
                {/* Team Member */}
                <td className="px-3 sm:px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-md font-bold text-white select-none"
                        style={{ background: "#5850ec" }}
                      >
                        {getInitials(member.name)}
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${STATUS_DOT[member.status]}`}
                      />
                    </div>
                    <span
                      className="font-medium text-sm sm:text-base"
                      style={{ color: theme.textColor.primary }}
                    >
                      {member.name}
                    </span>
                  </div>
                </td>

                {/* Role / Department */}
                <td className="px-3 sm:px-5 py-3.5">
                  <div className="flex flex-col gap-1">
                    <span
                      className="text-xs sm:text-sm w-fit px-3 py-2 rounded-lg text-gray-600 font-bold"
                      style={{ background: theme.background.secondary }}
                    >
                      {member.role}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td className="px-3 sm:px-5 py-3.5">
                  <span
                    className="text-xs sm:text-sm break-all"
                    style={{ color: theme.textColor.secondary }}
                  >
                    {member.email}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-3 sm:px-5 py-3.5">
                  <div className="flex items-center justify-center gap-1">
                    <a
                      href={`mailto:${member.email}`}
                      title="Send email"
                      className="p-1.5 rounded-md transition-colors hover:bg-indigo-50 text-gray-400 hover:text-indigo-600"
                    >
                      <FiMail size={14} />
                    </a>
                    <CopyEmailButton email={member.email} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {MEMBERS.length === 0 && (
        <div className="py-16 text-center text-sm" style={{ color: theme.textColor.muted }}>
          No team members found.
        </div>
      )}
    </div>
  );
};

export default InternalSupport_Table;
