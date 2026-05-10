import Button from "@/Component/ui/Button";
import { useCallback, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { EventTabs } from "../Constants/Event.constant";

const Event_View_Header = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("Upcoming Events");

  const handleSelectedTab = useCallback((tab: string) => {
    setSelectedTab(tab);
  }, []);

  return (
    <div
      className="pt-[3vh] border-b flex flex-col font-bold justify-between"
      style={{
        backgroundColor: "var(--cd-surface)",
        borderColor: "var(--cd-border)",
      }}
    >
      <div className="flex w-full justify-between items-start">
        <div className="w-1/2 xl:w-fit flex flex-col">
          <h1
            className="text-lg sm:text-[2.5vw] lg:text-2xl font-bold ml-5 w-fit"
            style={{ color: "var(--cd-text)" }}
          >
            Events
          </h1>
          <p className="text-sm lg:text-base ml-5 mt-1 w-fit" style={{ color: "var(--cd-text-2)" }}>
            Manage all your events in one place. Create, edit, and track event details with ease.
          </p>
        </div>
        <div className="flex items-center mr-[2vw]">
          <Button
            text="Create Event"
            onClick={() => navigate("/org/create-event")}
            icon={<IoMdAdd />}
          />
        </div>
      </div>

      <div className="flex space-x-1 mt-[4vh] ml-5 px-3">
        {EventTabs.map((tab) => (
          <button
            key={tab}
            className="px-4 py-2 border-b-2 text-sm font-medium transition-all duration-200"
            style={{
              color: selectedTab === tab ? "var(--cd-primary)" : "var(--cd-text-2)",
              borderColor: selectedTab === tab ? "var(--cd-primary)" : "transparent",
            }}
            onClick={() => handleSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Event_View_Header;
