import { IoMdArrowRoundBack } from "react-icons/io";
import { Member_Permissions, PermissionGate } from "@/permissions";
import { Link } from "react-router";
import Button from "../../../../Component/ui/Button";
import { memo } from "react";

const AddMemberHeader = () => {
  return (
    <div
      className="py-[3vh] w-full border-b flex text-xl font-bold justify-between"
      style={{
        backgroundColor: "var(--cd-surface)",
        borderColor: "var(--cd-border)",
      }}
    >
      <Link to="/org/member" className="w-1/3 h-full flex items-center">
        <h1 className="text-2xl font-bold ml-5 mt-2" style={{ color: "var(--cd-text)" }}>
          <IoMdArrowRoundBack className="mr-[3vw] inline" />
          Create New Member
        </h1>
      </Link>

      <div className="w-[40%] h-full mr-[3vw] flex justify-end gap-3">
        <PermissionGate permission={Member_Permissions.CREATE_MEMBER}>
          <Button
            text="Discard Draft"
            variant="secondary"
            onClick={() => alert("Discard Draft clicked")}
          />
        </PermissionGate>
        <PermissionGate permission={Member_Permissions.CREATE_MEMBER}>
          <Button text="Create Member" onClick={() => alert("Create Member clicked")} />
        </PermissionGate>
      </div>
    </div>
  );
};

export default memo(AddMemberHeader);
