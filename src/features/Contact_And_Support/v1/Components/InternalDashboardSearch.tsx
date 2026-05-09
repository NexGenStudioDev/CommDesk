import Input from "@/Component/ui/Input";
import { FaIdCardAlt, FaSearch } from "react-icons/fa";

const InternalDashboardSearch = () => {
  return (
    <div
      className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between border-b p-3 gap-3"
      style={{
        backgroundColor: "var(--cd-surface)",
        borderColor: "var(--cd-border)",
      }}
    >
      <span className="flex items-center gap-2">
        <FaIdCardAlt className="text-2xl" style={{ color: "var(--cd-primary)" }} />
        <h1
          className="text-base sm:text-lg lg:text-2xl font-bold"
          style={{ color: "var(--cd-text)" }}
        >
          Internal Directory
        </h1>
      </span>

      <div className="w-full lg:w-[45%]">
        <Input
          placeholder="Search Directory"
          name="Search"
          leftIcon={<FaSearch />}
          className="w-full mb-0"
          inputClassName="text-sm md:text-base"
        />
      </div>
    </div>
  );
};

export default InternalDashboardSearch;
