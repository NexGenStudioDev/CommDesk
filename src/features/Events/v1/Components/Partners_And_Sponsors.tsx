import { getTheme } from "@/config/them.config";
import { IoMdAdd } from "react-icons/io";
import Partners_And_Sponsors_Card from "./Partners_And_Sponsors_Card";

const PARTNERS = [
  {
    name: "Google",
    category: "Official Partner",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWIl8zC8WAMHi5JVmKUb3YVvZd5gvoCdy-NQ&s",
  },
  {
    name: "Microsoft",
    category: "Platinum Sponsor",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy0dDdi3KJgMq_87aJt9us_0yh69ewaKgUzg&s",
  },
  {
    name: "Amazon Web Services",
    category: "Gold Sponsor",
    image: "https://amcham.no/wp-content/uploads/2020/04/AWS-Logo-Final-768x768.png",
  },
  {
    name: "IBM",
    category: "Silver Sponsor",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxk2TBtiMBNmv3VO4APHeB-XCGatVy5aW0bw&s",
  },
];

type Partners_And_SponsorsProps = {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
};

const Partners_And_Sponsors = ({
  isExpanded = true,
  onToggleExpand,
}: Partners_And_SponsorsProps) => {
  const theme = getTheme("light");
  const visibleCount = PARTNERS.length;

  return (
    <div
      className="flex w-full flex-col rounded-lg border-2 p-4 shadow-sm transition-all duration-200"
      style={{
        background: theme.background.primary,
        borderColor: theme.borderColor.primary,
      }}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold uppercase text-black">Partners & Sponsors</h2>
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
            {visibleCount}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center justify-center gap-1 rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
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
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {PARTNERS.map((item) => (
            <Partners_And_Sponsors_Card
              key={item.name}
              name={item.name}
              category={item.category}
              image={item.image}
            />
          ))}
        </div>
      ) : (
        <p className="mt-2 rounded-md border border-dashed border-gray-300 px-3 py-2 text-xs text-gray-500">
          Collapsed. Click View to manage partners and sponsors.
        </p>
      )}
    </div>
  );
};

export default Partners_And_Sponsors;
