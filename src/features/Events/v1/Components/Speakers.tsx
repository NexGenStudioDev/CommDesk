import { useMemo, useState } from "react";
import Input from "@/Component/ui/Input";
import { getTheme } from "@/config/them.config";
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
  const theme = getTheme("light");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSpeakers = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();

    if (!normalizedQuery) {
      return SPEAKERS;
    }

    return SPEAKERS.filter((speaker) => {
      const searchableText = `${speaker.name} ${speaker.role}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });
  }, [searchTerm]);

  const visibleCount = isExpanded ? filteredSpeakers.length : SPEAKERS.length;

  return (
    <div
      className="flex flex-col w-full p-4 border-2 rounded-lg shadow-sm transition-all duration-200"
      style={{
        background: theme.background.primary,
        borderColor: theme.borderColor.primary,
      }}
    >
      <div className="mb-1 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-lg text-black uppercase">Speakers</h2>
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
            {visibleCount}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center justify-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
          >
            <IoMdAdd className="text-base" />
            Add
          </button>

          {onToggleExpand ? (
            <button
              type="button"
              onClick={onToggleExpand}
              className="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              {isExpanded ? "Hide" : "View"}
            </button>
          ) : null}
        </div>
      </div>

      {isExpanded ? (
        <>
          <div className="Search">
            <Input
              name="SearchSpeaker"
              placeholder="Search Speakers..."
              leftIcon={<CiSearch />}
              value={searchTerm}
              onChange={(_, value) => setSearchTerm(value)}
            />
          </div>

          <div className="mt-1 grid grid-cols-1 gap-3">
            {filteredSpeakers.length === 0 ? (
              <p className="rounded-md border border-dashed border-gray-300 px-3 py-4 text-sm text-gray-500">
                No speakers found.
              </p>
            ) : (
              filteredSpeakers.map((speaker) => (
                <SpeakerCard key={speaker.id} image={speaker.image} name={speaker.name} role={speaker.role} />
              ))
            )}
          </div>
        </>
      ) : (
        <p className="mt-2 rounded-md border border-dashed border-gray-300 px-3 py-2 text-xs text-gray-500">
          Collapsed. Click View to manage speakers.
        </p>
      )}
    </div>
  );
};

export default Speakers;
