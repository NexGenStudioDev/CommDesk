import { useState } from "react";
import PermissionHeader from "../Components/PermissionHeader";
import PermissionSearch from "../Components/PermissionSearch";
import MemberPermissionCard from "../Components/MemberPermissionCard";
import { permissionData } from "../mock/permissionData";

const PermissionPage = () => {
  const [filteredMembers, setFilteredMembers] = useState(permissionData);

  const handleSearch = (text: string, role: string) => {
    const result = permissionData.filter((member) => {
      const matchesName = member.name
        .toLowerCase()
        .includes(text.toLowerCase());
      const matchesRole =
        role === "All Roles" ? true : member.role === role;
      return matchesName && matchesRole;
    });
    setFilteredMembers(result);
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center gap-4 cd-page overflow-y-auto pb-10"
    >
      {/* Header */}
      <PermissionHeader />

      {/* Search & Filter */}
      <PermissionSearch onSearch={handleSearch} />

      {/* Cards Grid */}
      {filteredMembers.length > 0 ? (
        <div className="w-[90%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-10">
          {filteredMembers.map((member) => (
            <MemberPermissionCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
        /* Empty state */
        <div
          className="w-full flex flex-col items-center justify-center gap-3 mt-20"
        >
          <p
            className="text-lg font-semibold"
            style={{ color: "var(--cd-text)" }}
          >
            No members found
          </p>
          <p
            className="text-sm"
            style={{ color: "var(--cd-text-muted)" }}
          >
            Try adjusting your search or filter
          </p>
        </div>
      )}
    </div>
  );
};

export default PermissionPage;