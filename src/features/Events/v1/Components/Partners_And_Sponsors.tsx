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
  return (
    <div
      className="flex w-full flex-col rounded-xl p-4 transition-all duration-200"
      style={{
        backgroundColor: "var(--cd-surface)",
        border: "1px solid var(--cd-border)",
      }}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold uppercase" style={{ color: "var(--cd-text)" }}>
            Partners & Sponsors
          </h2>
          <span
            className="cd-badge"
            style={{ backgroundColor: "var(--cd-secondary)", color: "#ffffff", opacity: 0.9 }}
          >
            {PARTNERS.length}
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
        <p
          className="mt-2 rounded-xl border border-dashed px-3 py-2 text-xs"
          style={{ borderColor: "var(--cd-border)", color: "var(--cd-text-muted)" }}
        >
          Collapsed. Click View to manage partners and sponsors.
        </p>
      )}
    </div>
  );
};

export default Partners_And_Sponsors;
