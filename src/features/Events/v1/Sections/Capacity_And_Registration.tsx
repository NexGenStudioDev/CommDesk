import Input from "@/Component/ui/Input";
import { getTheme } from "@/config/them.config";
import React, { memo, useCallback } from "react";
import { FaTicketSimple } from "react-icons/fa6";
import DropDown from "@/Component/ui/DropDown";

const Capacity_And_Registration = () => {
  let theme = getTheme("light");

  let [eventData, setEventData] = React.useState({
    MaxAttendees: "",
    TicketType: "Free",
    TicketPrice: "",
  });

  const handleTicketTypeChange = useCallback((value: string) => {
    setEventData((prev) => ({
      ...prev,
      TicketType: value,
      TicketPrice: value === "Free" ? "" : prev.TicketPrice,
    }));
  }, []);

  return (
    <div
      className="flex flex-col w-full mt-[5vh] p-8 border-2 rounded-lg"
      style={{
        background: theme.background.primary,
        borderColor: theme.borderColor.primary,
      }}
    >
      <span className="font-extrabold text-xl text-gray-800 uppercase mb-[3vh] flex items-center gap-3">
        <FaTicketSimple className="text-[#4f46e5]" />
        Capacity & Registration
      </span>

      <div className="w-full h-full flex  gap-5">
        <div className="w-1/2">
          <Input
            name="MaxAttendees"
            label="Max Attendees"
            placeholder="eg: 500"
            value={eventData.MaxAttendees}
            onChange={(name, value) => setEventData({ ...eventData, [name]: value })}
          />

          <p className="text-sm text-gray-400 uppercase font-semibold">Leave blank for Unlimited</p>
        </div>

        <div className="w-1/2">
          <DropDown
            options={["Free", "Paid"]}
            label="Ticket Type"
            value={eventData.TicketType}
            onSelect={handleTicketTypeChange}
            className="w-full"
          />
        </div>
      </div>

      {eventData.TicketType === "Paid" && (
        <Input
          name="TicketPrice"
          label="Ticket Price"
          placeholder="eg: $20"
          className="mt-[3vh]"
          value={eventData.TicketPrice}
          onChange={(name, value) => setEventData({ ...eventData, [name]: value })}
        />
      )}
    </div>
  );
};

export default memo(Capacity_And_Registration);
