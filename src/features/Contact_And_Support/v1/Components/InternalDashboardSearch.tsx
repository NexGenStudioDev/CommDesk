import Input from "@/Component/ui/Input";
import { getTheme } from "@/config/them.config";
import { FaIdCardAlt, FaSearch } from "react-icons/fa";

const InternalDashboardSearch = () => {
  let theme = getTheme("light");

  return (
    <div
      className="Table_Header bg-white w-full flex flex-col lg:flex-row lg:items-center lg:justify-between border-b-2 p-3 gap-3"
      style={{ borderColor: theme.borderColor.primary }}
    >
      <span className="flex items-center">
        <FaIdCardAlt className="inline text-2xl text-[#5850ec]" />
        <h1 className="text-base sm:text-lg lg:text-2xl font-bold text-gray-800 ml-3 sm:ml-5">
          Internal Directory
        </h1>
      </span>

      <div className="w-full lg:w-[45%]">
        <Input
          placeholder="Search Directory"
          name="Search"
          leftIcon={<FaSearch />}
          className="w-full bg-[#f8fafc] mb-0"
          inputClassName="text-sm md:text-base"
        />
      </div>
    </div>
  );
};

export default InternalDashboardSearch;
