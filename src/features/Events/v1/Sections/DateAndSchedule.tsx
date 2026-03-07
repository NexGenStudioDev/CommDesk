import { IoMdCalendar } from "react-icons/io";
import { getTheme } from "../../../../config/them.config";
import { Input } from "../../../../Component/ui/Input";
import { memo, useState } from "react";
import { FaBuilding } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import Date from "../../../../Component/ui/Date";
import Time from "../../../../Component/ui/Time";

const DateAndSchedule = () => {
  let theme = getTheme("light");

  let [eventData, setEventData] = useState({
    EventName: "",
    FullAddress: "",
    StartDate: "",

    EndDate: "",
    StartTime: "",
    EndTime: "",
  });

  return (
    <div
      className="flex flex-col w-full mt-[5vh] p-8 border-2 rounded-lg"
      style={{
        background: theme.background.primary,
        borderColor: theme.borderColor.primary,
      }}
    >
      <span className="font-extrabold text-xl text-gray-800 uppercase mb-[3vh] flex items-center gap-3">
        <IoMdCalendar className="text-[#4f46e5]" />
        Date & Schedule
      </span>

      <div className="Start_and_End_Dates Start_and_End_Time flex w-full gap-4 my-[2vh]">
        <div className="StartDate_And_Time w-1/2 pr-2 flex flex-col gap-4  p-4 rounded-lg ">
          <p className="text-md text-gray-400 uppercase font-semibold">Start Date & Time</p>
          <div className="flex w-full gap-3">
            <Date className="w-1/2" />
            <Time className="w-1/2" />
          </div>
        </div>

        <div className="EndDate_And_Time w-1/2 pr-2 flex flex-col gap-4  p-4 rounded-lg">
          <p className="text-md text-gray-400 uppercase font-semibold">End Date & Time</p>
          <div className="flex w-full gap-3">
            <Date className="w-1/2" />
            <Time
              className="w-1/2"
              value={eventData.EndTime}
              onChange={(e) => setEventData((prev) => ({ ...prev, EndTime: e }))}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col w-[45%]">
          <Input
            type="text"
            name="EventName"
            label="Venue Name"
            placeholder="IIT Dhanbad Campus"
            onChange={(name, value) => setEventData({ ...eventData, [name]: value })}
            leftIcon={<FaBuilding />}
          />

          <Input
            type="text"
            name="FullAddress"
            label="Full Address"
            placeholder="123 Main Street"
            onChange={(name, value) => setEventData({ ...eventData, [name]: value })}
            leftIcon={<FaLocationDot />}
          />
        </div>

        <div className="w-[60%] bg-red-600 h-[35vh] rounded-2xl"></div>
      </div>
    </div>
  );
};

export default memo(DateAndSchedule);
