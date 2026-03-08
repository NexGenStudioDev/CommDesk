import { useState } from "react";
import { getTheme } from "../../../../config/them.config";
import Judge from "../Components/Judge";
import Mentors from "../Components/Mentors";
import Speakers from "../Components/Speakers";
import Capacity_And_Registration from "../Sections/Capacity_And_Registration";
import DateAndSchedule from "../Sections/DateAndSchedule";
import Event_Basic_Info from "../Sections/Event_Basic_Info";
import Event_Header from "../Sections/Event_Header";
import Settings from "../Sections/Settings";

type PanelKey = "speakers" | "mentors" | "judges";

const CreateNewEvent = () => {
  let theme = getTheme("light");
  const [expandedPanel, setExpandedPanel] = useState<PanelKey | null>("speakers");

  const handlePanelToggle = (panel: PanelKey) => {
    setExpandedPanel((current) => (current === panel ? null : panel));
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ background: theme.background.secondary }}>
      <Event_Header />
      <div className="flex w-full p-[2vw]  gap-5">
        <div className="w-[65%]  mb-[2vh] bg-gray-200 rounded-lg p-4">
          <Event_Basic_Info />
          <DateAndSchedule />
          <Capacity_And_Registration />
        </div>
        <div className="w-[35%] h-screen rounded-2xl space-y-5 overflow-y-auto pr-1">
          <Settings />
          <Speakers
            isExpanded={expandedPanel === "speakers"}
            onToggleExpand={() => handlePanelToggle("speakers")}
          />
          <Mentors
            isExpanded={expandedPanel === "mentors"}
            onToggleExpand={() => handlePanelToggle("mentors")}
          />
          <Judge isExpanded={expandedPanel === "judges"} onToggleExpand={() => handlePanelToggle("judges")} />
        </div>
      </div>
    </div>
  );
};

export default CreateNewEvent;
