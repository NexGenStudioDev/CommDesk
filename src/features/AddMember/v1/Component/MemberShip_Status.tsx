
import { useFormContext } from "react-hook-form";
import type { MemberFormValues } from "../Validator/AddMember.Validator";

type MembershipStatus = "Active" | "Inactive" | "Pending" | "Suspended" | "On Boarding";

const MemberShip_Status = () => {
  const statusColorMap: Record<MembershipStatus, string> = {
    Active: "bg-green-500",
    Inactive: "bg-gray-400",
    Pending: "bg-yellow-400",
    Suspended: "bg-red-500",
    "On Boarding": "bg-blue-400",
  };

  const { watch, setValue, formState } = useFormContext<MemberFormValues>();
  const { errors } = formState;
  const membershipStatus = (watch("membershipStatus") ?? "On Boarding") as MembershipStatus;

  return (
    <div className="MemberShip_Status flex flex-col gap-2 mt-4 text-lg">
      {/* Active */}
      <div className="flex items-center gap-4">
        <input
          type="radio"
          name="membershipStatus"
          id="Active"
          value="Active"
          checked={membershipStatus === "Active"}
          onChange={() => setValue("membershipStatus", "Active", { shouldDirty: true })}
        />

        <span
          className={`w-4 h-4 rounded-full ${statusColorMap["Active"]} border border-gray-300`}
        ></span>
        <label htmlFor="Active">Active</label>
      </div>

      {errors.membershipStatus && (
        <p className="text-red-500 text-sm">{errors.membershipStatus.message}</p>
      )}

      {/* Inactive */}
      <div className="flex items-center gap-4">
        <input
          type="radio"
          id="Inactive"
          name="membershipStatus"
          value="Inactive"
          checked={membershipStatus === "Inactive"}
          onChange={() => setValue("membershipStatus", "Inactive", { shouldDirty: true })}
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
          onChange={() => setValue("membershipStatus", "Pending", { shouldDirty: true })}
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
          onChange={() => setValue("membershipStatus", "On Boarding", { shouldDirty: true })}
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
          onChange={() => setValue("membershipStatus", "Suspended", { shouldDirty: true })}
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
