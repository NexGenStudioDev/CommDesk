import { getTheme } from "../../../../config/them.config";
import Capacity_And_Registration from "../Sections/Capacity_And_Registration";
import DateAndSchedule from "../Sections/DateAndSchedule";
import Event_Basic_Info from "../Sections/Event_Basic_Info";
import Event_Header from "../Sections/Event_Header";
import Settings from "../Sections/Settings";

const CreateNewEvent = () => {
  let theme = getTheme("light");

  return (
    <div className="w-full h-full flex flex-col" style={{ background: theme.background.secondary }}>
      <Event_Header />
      <div className="flex w-full p-[2vw]  gap-5">
        <div className="w-[65%]  mb-[2vh] bg-gray-200 rounded-lg p-4">
          <Event_Basic_Info />
          <DateAndSchedule />
          <Capacity_And_Registration />
        </div>
        <div className="w-[35%] h-screen  rounded-2xl">
          <Settings />
        </div>
      </div>
    </div>
  );
};

export default CreateNewEvent;
