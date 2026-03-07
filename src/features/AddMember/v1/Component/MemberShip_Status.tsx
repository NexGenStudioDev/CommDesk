import { useState } from "react";

type MembershipStatus = "Active" | "Inactive" | "Pending" | "Suspended" | "On Boarding";

const MemberShip_Status = () => {
  const [membershipStatus, setMembershipStatus] = useState<MembershipStatus>("Active");

  const statusColorMap: Record<MembershipStatus, string> = {
    Active: "bg-green-500",
    Inactive: "bg-gray-400",
    Pending: "bg-yellow-400",
    Suspended: "bg-red-500",
    "On Boarding": "bg-blue-400",
  };

  return (
    <div className="MemberShip_Status flex flex-col gap-2 mt-4 text-lg">
      <p className="text-md font-semibold">Membership Status</p>

      {/* Active */}
      <div className="flex items-center gap-4">
        <input
          type="radio"
          name="membershipStatus"
          id="Active"
          value="Active"
          checked={membershipStatus === "Active"}
          onChange={() => setMembershipStatus("Active")}
        />

        <span
          className={`w-4 h-4 rounded-full ${statusColorMap["Active"]} border border-gray-300`}
        ></span>
        <label htmlFor="Active">Active</label>
      </div>

      {/* Inactive */}
      <div className="flex items-center gap-4">
        <input
          type="radio"
          id="Inactive"
          name="membershipStatus"
          value="Inactive"
          checked={membershipStatus === "Inactive"}
          onChange={() => setMembershipStatus("Inactive")}
        />

        <span
          className={`w-4 h-4 rounded-full ${statusColorMap["Inactive"]} border border-gray-300`}
        ></span>

        <label htmlFor="Inactive">Inactive</label>
      </div>

      {/* Pending */}
      <div className="flex items-center gap-4">
        <input
          type="radio"
          name="membershipStatus"
          value="Pending"
          id="Pending"
          checked={membershipStatus === "Pending"}
          onChange={() => setMembershipStatus("Pending")}
        />

        <span
          className={`w-4 h-4 rounded-full ${statusColorMap["Pending"]} border border-gray-300`}
        ></span>
        <label htmlFor="Pending">Pending</label>
      </div>

      {/* On Boarding */}
      <div className="flex items-center gap-4">
        <input
          type="radio"
          name="membershipStatus"
          id="OnBoarding"
          value="On Boarding"
          checked={membershipStatus === "On Boarding"}
          onChange={() => setMembershipStatus("On Boarding")}
        />
        <span
          className={`w-4 h-4 rounded-full ${statusColorMap["On Boarding"]} border border-gray-300`}
        ></span>
        <label htmlFor="OnBoarding">On Boarding</label>
      </div>

      {/* Suspended */}
      <div className="flex items-center gap-4">
        <input
          type="radio"
          name="membershipStatus"
          id="Suspended"
          value="Suspended"
          checked={membershipStatus === "Suspended"}
          onChange={() => setMembershipStatus("Suspended")}
        />

        <span
          className={`w-4 h-4 rounded-full ${statusColorMap["Suspended"]} border border-gray-300`}
        ></span>
        <label htmlFor="Suspended">Suspended</label>
      </div>
    </div>
  );
};

export default MemberShip_Status;
