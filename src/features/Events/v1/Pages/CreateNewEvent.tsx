import { useState } from "react";
import { AccessDenied, Event_Permissions, PermissionBoundary, PermissionLoading } from "@/permissions";
import Judge from "../Components/Judge";
import Mentors from "../Components/Mentors";
import Speakers from "../Components/Speakers";
import Capacity_And_Registration from "../Sections/Capacity_And_Registration";
import DateAndSchedule from "../Sections/DateAndSchedule";
import Event_Basic_Info from "../Sections/Event_Basic_Info";
import Event_Header from "../Sections/Event_Header";
import Settings from "../Sections/Settings";
import Partners_And_Sponsors from "../Components/Partners_And_Sponsors";

type PanelKey = "speakers" | "mentors" | "judges" | "partners";

const CreateNewEvent = () => {
  const [expandedPanel, setExpandedPanel] = useState<PanelKey | null>("speakers");

  const handlePanelToggle = (panel: PanelKey) => {
    setExpandedPanel((current) => (current === panel ? null : panel));
  };

  return (
    <div className="w-full h-full flex flex-col cd-page">
      <Event_Header />
      <PermissionBoundary
        permission={Event_Permissions.CREATE_EVENT}
        loadingFallback={<PermissionLoading />}
        unauthorizedFallback={
          <AccessDenied
            title="You cannot create events yet"
            description="Ask an administrator for event creation access to manage drafts, settings, speakers, and publishing tools."
          />
        }
      >
        <div className="flex flex-col items-center min-[1408px]:items-start min-[1408px]:flex-row w-full p-[2vw] gap-5">
          <div
            className="w-[90%] min-[1408px]:w-[65%] mb-[2vh] rounded-xl p-4"
            style={{
              backgroundColor: "var(--cd-surface-2)",
              border: "1px solid var(--cd-border)",
            }}
          >
            <Event_Basic_Info />
            <DateAndSchedule />
            <Capacity_And_Registration />
          </div>
          <div
            className="w-[90%] min-[1408px]:w-[35%] min-[1408px]:h-screen rounded-xl space-y-5 min-[1408px]:overflow-y-auto pr-1 p-4"
            style={{
              backgroundColor: "var(--cd-surface-2)",
              border: "1px solid var(--cd-border)",
            }}
          >
            <Settings />
            <Speakers
              isExpanded={expandedPanel === "speakers"}
              onToggleExpand={() => handlePanelToggle("speakers")}
            />
            <Mentors
              isExpanded={expandedPanel === "mentors"}
              onToggleExpand={() => handlePanelToggle("mentors")}
            />
            <Judge
              isExpanded={expandedPanel === "judges"}
              onToggleExpand={() => handlePanelToggle("judges")}
            />
            <Partners_And_Sponsors
              isExpanded={expandedPanel === "partners"}
              onToggleExpand={() => handlePanelToggle("partners")}
            />
          </div>
        </div>
      </PermissionBoundary>
    </div>
  );
};

export default CreateNewEvent;
