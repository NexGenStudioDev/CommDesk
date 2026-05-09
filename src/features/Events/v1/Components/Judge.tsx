import { useMemo, useState } from "react";
import Input from "@/Component/ui/Input";
import { CiSearch } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import JudgeCard from "./JudgeCard";

type JudgeProps = {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
};

const JUDGES = [
  { id: 1, image: "https://randomuser.me/api/portraits/men/36.jpg", name: "Kabir Shah", role: "Technical Judge" },
  { id: 2, image: "https://randomuser.me/api/portraits/women/31.jpg", name: "Meera Joshi", role: "Design Judge" },
];

const Judge = ({ isExpanded = true, onToggleExpand }: JudgeProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return q ? JUDGES.filter((j) => `${j.name} ${j.role}`.toLowerCase().includes(q)) : JUDGES;
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
            Judges
          </h2>
          <span
            className="cd-badge"
            style={{ backgroundColor: "var(--cd-warning-subtle)", color: "var(--cd-warning)" }}
          >
            {isExpanded ? filtered.length : JUDGES.length}
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
            name="SearchJudge"
            placeholder="Search Judges..."
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
                No judges found.
              </p>
            ) : (
              filtered.map((j) => (
                <JudgeCard key={`judge-${j.id}`} image={j.image} name={j.name} role={j.role} />
              ))
            )}
          </div>
        </>
      ) : (
        <p
          className="mt-2 rounded-xl border border-dashed px-3 py-2 text-xs"
          style={{ borderColor: "var(--cd-border)", color: "var(--cd-text-muted)" }}
        >
          Collapsed. Click View to manage judges.
        </p>
      )}
    </div>
  );
};

export default Judge;
