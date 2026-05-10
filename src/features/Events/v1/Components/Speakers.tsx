import { useMemo, useState } from "react";
import Input from "@/Component/ui/Input";
import { CiSearch } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import SpeakerCard from "./SpeakerCard";

type SpeakersProps = {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
};

const SPEAKERS = [
  {
    id: 1,
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Aanya Patel",
    role: "Product Strategist",
  },
  {
    id: 2,
    image: "https://randomuser.me/api/portraits/men/41.jpg",
    name: "Rohan Mehta",
    role: "Engineering Lead",
  },
  {
    id: 3,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Nisha Verma",
    role: "Community Mentor",
  },
];

const Speakers = ({ isExpanded = true, onToggleExpand }: SpeakersProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return q ? SPEAKERS.filter((s) => `${s.name} ${s.role}`.toLowerCase().includes(q)) : SPEAKERS;
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
            Speakers
          </h2>
          <span
            className="cd-badge cd-badge-primary"
            style={{ backgroundColor: "var(--cd-primary-subtle)", color: "var(--cd-primary-text)" }}
          >
            {isExpanded ? filtered.length : SPEAKERS.length}
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
            name="SearchSpeaker"
            placeholder="Search Speakers..."
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
                No speakers found.
              </p>
            ) : (
              filtered.map((s) => (
                <SpeakerCard key={s.id} image={s.image} name={s.name} role={s.role} />
              ))
            )}
          </div>
        </>
      ) : (
        <p
          className="mt-2 rounded-xl border border-dashed px-3 py-2 text-xs"
          style={{ borderColor: "var(--cd-border)", color: "var(--cd-text-muted)" }}
        >
          Collapsed. Click View to manage speakers.
        </p>
      )}
    </div>
  );
};

export default Speakers;
