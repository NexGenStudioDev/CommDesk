import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import DropDown from "@/Component/ui/DropDown";
import Button from "@/Component/ui/Button";

const ROLE_OPTIONS = ["All Roles", "Admin", "Organizer", "Volunteer", "Member", "Visitor"];

type PermissionSearchProps = {
  onSearch: (text: string, role: string) => void;
};

const PermissionSearch = ({ onSearch }: PermissionSearchProps) => {
  const [searchText, setSearchText] = useState("");
  const [selectedRole, setSelectedRole] = useState(ROLE_OPTIONS[0]);

  const handleSearch = () => {
    onSearch(searchText, selectedRole);
  };

  return (
    <div
      className="w-[90%] mt-[4vh] flex items-center p-3 rounded-2xl border gap-3"
      style={{
        backgroundColor: "var(--cd-surface)",
        borderColor: "var(--cd-border)",
      }}
    >
      {/* Search input */}
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
          placeholder="Search member by name..."
          className="flex-1 h-full bg-transparent outline-none text-sm"
          style={{ color: "var(--cd-text)" }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Role filter */}
      <div className="w-40">
        <DropDown
          options={ROLE_OPTIONS}
          onSelect={setSelectedRole}
        />
      </div>

      {/* Search button */}
      <Button
        text="Search"
        icon={<CiSearch />}
        onClick={handleSearch}
      />
    </div>
  );
};

export default PermissionSearch;