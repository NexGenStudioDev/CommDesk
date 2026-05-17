import Event_View_Header from "../Sections/Event_View_Header";
import { AccessDenied, Event_Permissions, PermissionBoundary, PermissionLoading } from "@/permissions";
import EventTable from "../Components/EventTable";
import { FaRocket, FaCode, FaGlobe, FaBolt, FaPalette } from "react-icons/fa";
import { Event } from "../Event.type";

const events: Event[] = [
  {
    id: 1,
    name: "Summer AI Challenge 2024",
    subtitle: "Sponsored by TechCorp",
    logo: <FaRocket />,
    date: "Jun 15 - Jun 17, 2024",
    status: "Live",
    teams: 142,
    submissions: "-",
  },
  {
    id: 2,
    name: "Web3 Builders Sprint",
    subtitle: "Internal Team Event",
    logo: <FaCode />,
    date: "Jul 01 - Jul 03, 2024",
    status: "Upcoming",
    teams: 45,
    submissions: "-",
  },
  {
    id: 3,
    name: "Global Open Source Hack",
    subtitle: "Public Event",
    logo: <FaGlobe />,
    date: "May 10 - May 12, 2024",
    status: "Completed",
    teams: 218,
    submissions: 86,
  },
  {
    id: 4,
    name: "Speed Code Blitz",
    subtitle: "Internal Team Event",
    logo: <FaBolt />,
    date: "Apr 22 - Apr 22, 2024",
    status: "Completed",
    teams: 56,
    submissions: 12,
  },
  {
    id: 5,
    name: "Design Systems Hack",
    subtitle: "Design Dept.",
    logo: <FaPalette />,
    date: "Aug 05 - Aug 07, 2024",
    status: "Upcoming",
    teams: 24,
    submissions: "-",
  },
  {
    id: 6,
    name: "Design Systems Hack",
    subtitle: "Design Dept.",
    logo: <FaPalette />,
    date: "Aug 05 - Aug 07, 2024",
    status: "Upcoming",
    teams: 24,
    submissions: "-",
  },
  {
    id: 7,
    name: "Design Systems Hack",
    subtitle: "Design Dept.",
    logo: <FaPalette />,
    date: "Aug 05 - Aug 07, 2024",
    status: "Upcoming",
    teams: 24,
    submissions: "-",
  },
];

const ViewEvent = () => {
  return (
    <div className="w-full h-full flex flex-col cd-page">
      <Event_View_Header />
      <PermissionBoundary
        permission={Event_Permissions.VIEW_EVENT}
        loadingFallback={<PermissionLoading />}
        unauthorizedFallback={
          <AccessDenied
            title="Event access is unavailable"
            description="This view is only shown to members who can view event schedules, participation, and management actions."
          />
        }
      >
        <div className="w-full h-full p-[3vw]">
          <EventTable events={events} itemsPerPage={5} />
        </div>
      </PermissionBoundary>
    </div>
  );
};

export default ViewEvent;
