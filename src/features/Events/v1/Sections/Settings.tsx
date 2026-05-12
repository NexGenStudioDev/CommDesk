import { IoSettingsSharp } from "react-icons/io5";
import EventSetting from "../Components/EventSetting";
import { theme } from "@/theme";

const Settings = () => {

  return (
    <div
      className="flex flex-col w-full  p-4 border-2 rounded-lg  "
      style={{
        background: theme.bg.surface,
        borderColor: theme.border.default,
      }}
    >
      <span className="font-bold text-xl text-gray-800  uppercase mb-[3vh] flex items-center justify-between gap-3">
        {/* <IoMdCalendar className="text-[#4f46e5]" /> */}
        Settings
        <IoSettingsSharp className="text-[#4f46e5]" />
      </span>

      <EventSetting title="Public Visible" description="Show this event to public or not." />
      <EventSetting title="Required RSVP" description="mandatory registration required." />
      <EventSetting
        title="Allow Waitlist"
        description="If capacity is reached, allow users to join a waitlist."
      />
    </div>
  );
};

export default Settings;
