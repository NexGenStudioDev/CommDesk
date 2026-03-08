import { useMemo, useState } from "react";
import Input from "@/Component/ui/Input";
import { getTheme } from "@/config/them.config";
import { CiSearch } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import MentorCard from "./MentorCard";

type MentorsProps = {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
};

const MENTORS = [
  {
    id: 1,
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    name: "Arjun Rao",
    role: "Startup Mentor",
  },
  {
    id: 2,
    image: "https://randomuser.me/api/portraits/women/63.jpg",
    name: "Priya Nair",
    role: "Leadership Mentor",
  },
];

const Mentors = ({ isExpanded = true, onToggleExpand }: MentorsProps) => {
  const theme = getTheme("light");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMentors = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();

    if (!normalizedQuery) {
      return MENTORS;
    }

    return MENTORS.filter((mentor) => {
      const searchableText = `${mentor.name} ${mentor.role}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });
  }, [searchTerm]);

  const visibleCount = isExpanded ? filteredMentors.length : MENTORS.length;

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
          <h2 className="font-bold text-lg text-black uppercase">Mentors</h2>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            {visibleCount}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center justify-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
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
              name="SearchMentor"
              placeholder="Search Mentors..."
              leftIcon={<CiSearch />}
              value={searchTerm}
              onChange={(_, value) => setSearchTerm(value)}
            />
          </div>

          <div className="mt-1 grid grid-cols-1 gap-3">
            {filteredMentors.length === 0 ? (
              <p className="rounded-md border border-dashed border-gray-300 px-3 py-4 text-sm text-gray-500">
                No mentors found.
              </p>
            ) : (
              filteredMentors.map((mentor) => (
                <MentorCard key={`mentor-${mentor.id}`} image={mentor.image} name={mentor.name} role={mentor.role} />
              ))
            )}
          </div>
        </>
      ) : (
        <p className="mt-2 rounded-md border border-dashed border-gray-300 px-3 py-2 text-xs text-gray-500">
          Collapsed. Click View to manage mentors.
        </p>
      )}
    </div>
  );
};

export default Mentors;