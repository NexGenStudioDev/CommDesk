import Input from "@/Component/ui/Input";
import { getTheme } from "@/config/them.config";
import React from "react";
import { FaIdCardAlt, FaSearch } from "react-icons/fa";

const InternalDashboardSearch = () => {
  let theme = getTheme("light");

  return (
    <div
      className="Table_Header  bg-white w-full flex justify-between border-b-2"
      style={{ borderColor: theme.borderColor.primary }}
    >
      <span className="flex items-center  p-3 ">
        <FaIdCardAlt className="inline text-2xl text-[#5850ec]" />
        <h1 className="text-lg sm:text-[2.5vw] lg:text-2xl font-bold text-gray-800  ml-5 ">
          Internal Directory
        </h1>
      </span>

      <div className="w-1/2 h-[10vh] flex items-center px-4">
        <Input
          placeholder="Search Directory"
          name="Search"
          leftIcon={<FaSearch />}
          className="w-full bg-[#f8fafc]"
        />
      </div>
    </div>
  );
};

export default InternalDashboardSearch;
