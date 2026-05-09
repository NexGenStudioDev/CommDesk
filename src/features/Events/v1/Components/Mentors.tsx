import { useMemo, useState } from "react";
import Input from "@/Component/ui/Input";
import { CiSearch } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import MentorCard from "./MentorCard";

type MentorsProps = {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
};

const MENTORS = [
  { id: 1, image: "https://randomuser.me/api/portraits/men/52.jpg", name: "Arjun Rao", role: "Startup Mentor" },
  { id: 2, image: "https://randomuser.me/api/portraits/women/63.jpg", name: "Priya Nair", role: "Leadership Mentor" },
];

const Mentors = ({ isExpanded = true, onToggleExpand }: MentorsProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return q ? MENTORS.filter((m) => `${m.name} ${m.role}`.toLowerCase().includes(q)) : MENTORS;
  }, [searchTerm]);

  return (
    <div
      className="flex flex-col w-full p-4 rounded-xl transition-all duration-200"
      style={{
        backgroundColor: "var(--cd-surface)",
        border: "1px solid var(--cd-border)",
      }}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-base uppercase" style={{ color: "var(--cd-text)" }}>
            Mentors
          </h2>
          <span
            className="cd-badge"
            style={{ backgroundColor: "var(--cd-success-subtle)", color: "var(--cd-success)" }}
          >
            {isExpanded ? filtered.length : MENTORS.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="cd-btn cd-btn-primary px-2.5 py-1.5 text-xs">
            <IoMdAdd className="text-base" /> Add
          </button>
          {onToggleExpand && (
            <button
              type="button"
              onClick={onToggleExpand}
              className="cd-btn cd-btn-secondary px-2.5 py-1.5 text-xs"
            >
              {isExpanded ? "Hide" : "View"}
            </button>
          )}
        </div>
      </div>

      {isExpanded ? (
        <>
          <Input
            name="SearchMentor"
            placeholder="Search Mentors..."
            leftIcon={<CiSearch />}
            value={searchTerm}
            onChange={(_, value) => setSearchTerm(value)}
          />
          <div className="mt-1 grid grid-cols-1 gap-3">
            {filtered.length === 0 ? (
              <p
                className="rounded-xl border border-dashed px-3 py-4 text-sm"
                style={{ borderColor: "var(--cd-border)", color: "var(--cd-text-muted)" }}
              >
                No mentors found.
              </p>
            ) : (
              filtered.map((m) => (
                <MentorCard key={`mentor-${m.id}`} image={m.image} name={m.name} role={m.role} />
              ))
            )}
          </div>
        </>
      ) : (
        <p
          className="mt-2 rounded-xl border border-dashed px-3 py-2 text-xs"
          style={{ borderColor: "var(--cd-border)", color: "var(--cd-text-muted)" }}
        >
          Collapsed. Click View to manage mentors.
        </p>
      )}
    </div>
  );
};

export default Mentors;
