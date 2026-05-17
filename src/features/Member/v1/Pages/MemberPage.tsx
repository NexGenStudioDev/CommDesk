import MemberHeader from "../Components/MemberHeader";
import { AccessDenied, Member_Permissions, PermissionBoundary, PermissionLoading } from "@/permissions";
import MemberTable from "../Components/MemberTable";
import SearchMember from "../Components/SearchMember";

const membersData = [
  {
    name: "John Doe",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    role: "Mentor",
    status: "Active",
    skills: "JavaScript, React",
    certificates: "05",
  },
  {
    name: "Jane Smith",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    role: "Mentee",
    status: "Inactive",
    skills: "Python, Data Science",
    certificates: "03",
  },
  {
    name: "Alice Johnson",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    role: "Lean Developer",
    status: "On Boarding",
    skills: "Java, Spring Boot",
    certificates: "01",
  },
  {
    name: "Bob Brown",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    role: "Observer",
    status: "Banned",
    skills: "C#, .NET",
    certificates: "08",
  },
];

const MemberPage = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center gap-4 cd-page">
      <MemberHeader />
      <PermissionBoundary
        permission={Member_Permissions.VIEW_MEMBER}
        loadingFallback={<PermissionLoading />}
        unauthorizedFallback={
          <AccessDenied
            title="Member directory access is unavailable"
            description="Ask an administrator for member viewing permission to browse profiles and management actions."
          />
        }
      >
        <SearchMember />
        <MemberTable members={membersData} />
      </PermissionBoundary>
    </div>
  );
};

export default MemberPage;
