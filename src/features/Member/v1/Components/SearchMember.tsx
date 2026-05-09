import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import DropDown from "../../../../Component/ui/DropDown";
import Button from "../../../../Component/ui/Button";

const ROLE_OPTIONS = ["All Roles", "Mentor", "Lean Developer", "Mentee", "Observer", "Other"];
const STATUS_OPTIONS = ["Active", "Inactive", "Pending", "Banned", "On Boarding"];

const SearchMember = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedRole, setSelectedRole] = useState(ROLE_OPTIONS[0]);
  const [selectedStatus, setSelectedStatus] = useState(STATUS_OPTIONS[0]);

  const handleSearch = () => {
    console.log("Member search filters:", { searchText, role: selectedRole, status: selectedStatus });
  };

  return (
    <div
      className="w-[90%] mt-[4vh] flex items-center p-3 rounded-2xl border gap-3"
      style={{
        backgroundColor: "var(--cd-surface)",
        borderColor: "var(--cd-border)",
      }}
    >
      <div
        className="flex-1 h-10 flex items-center gap-2 px-3 border rounded-lg"
        style={{
          backgroundColor: "var(--cd-surface-2)",
          borderColor: "var(--cd-border)",
        }}
      >
        <CiSearch style={{ color: "var(--cd-text-muted)" }} />
        <input
          type="text"
          placeholder="Search Member"
          className="flex-1 h-full bg-transparent outline-none text-sm"
          style={{ color: "var(--cd-text)" }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="flex gap-3">
        <DropDown options={ROLE_OPTIONS} onSelect={setSelectedRole} />
        <DropDown options={STATUS_OPTIONS} onSelect={setSelectedStatus} />
      </div>

      <Button text="Search" icon={<CiSearch />} onClick={handleSearch} />
    </div>
  );
};

export default SearchMember;
