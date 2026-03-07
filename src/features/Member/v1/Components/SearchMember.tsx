import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { getTheme } from "../../../../config/them.config";
import DropDown from "../../../../Component/ui/DropDown";
import Button from "../../../../Component/ui/Button";

const ROLE_OPTIONS = ["All Roles", "Mentor", "Lean Developer", "Mentee", "Observer", "Other"];
const STATUS_OPTIONS = ["Active", "Inactive", "Pending", "Banned", "On Bording"];

const SearchMember = () => {
  let theme = getTheme("light");
  const [searchText, setSearchText] = useState("");
  const [selectedRole, setSelectedRole] = useState(ROLE_OPTIONS[0]);
  const [selectedStatus, setSelectedStatus] = useState(STATUS_OPTIONS[0]);

  const handleSearch = () => {
    console.log("Member search filters:", {
      searchText,
      role: selectedRole,
      status: selectedStatus,
    });
  };

  return (
    <div
      className="bg-white w-[90%] h-[7vh] mt-[4vh] flex items-center p-3 rounded-2xl border "
      style={{
        borderColor: theme.borderColor.primary,
      }}
    >
      <div
        className="Search_Container bg-[#f8fafc] w-1/2 h-full flex items-center gap-4 px-4 border rounded-lg mr-4"
        style={{
          borderColor: theme.borderColor.primary,
          backgroundColor: theme.background.secondary,
        }}
      >
        <CiSearch />
        <input
          type="text"
          placeholder="Search Member"
          className="w-full h-full px-4 text-lg outline-none"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="DropDownContainer flex gap-3 mr-[2vw]">
        <DropDown options={ROLE_OPTIONS} onSelect={setSelectedRole} />
        <DropDown options={STATUS_OPTIONS} onSelect={setSelectedStatus} />
      </div>

      <Button text="Search" width="8vw" icon={<CiSearch />} onClick={handleSearch} />
    </div>
  );
};

export default SearchMember;
