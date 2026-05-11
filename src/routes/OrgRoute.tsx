import { Route, Routes } from "react-router";
import AddMemberPage from "@/features/AddMember/v1/Page/AddMemberPage";
import Contact from "@/features/Contact_And_Support/v1/Pages/Contact";
import DashBoardPage from "@/features/Dashboard/Organisation/v1/Pages/DashBoardPage";
import CreateNewEvent from "@/features/Events/v1/Pages/CreateNewEvent";
import ViewEvent from "@/features/Events/v1/Pages/ViewEvent";
import MemberPage from "@/features/Member/v1/Pages/MemberPage";
import ProjectsPage from "@/features/Projects/Pages/ProjectsPage";
import Organisation_Template from "@/features/template/LoginUserTemplate";
import PermissionPage from "@/features/Permissions/v1/Pages/PermissionPage";

const OrgRoute = () => {
  return (
    <Routes>

         <Route path="/org" element={<Organisation_Template />}>
      {/* Dashboard */}
      <Route index element={<DashBoardPage />} />

      <Route path="dashboard" element={<DashBoardPage />} />

      <Route path="member" element={<MemberPage />} />

      {/* Events */}
      <Route path="events" element={<ViewEvent />} />

      <Route path="projects" element={<ProjectsPage />} />

      <Route path="create-event" element={<CreateNewEvent />} />

      {/* Contact */}
      <Route path="contact" element={<Contact />} />

      {/* Add Member */}
      <Route path="add-member" element={<AddMemberPage />} />

      <Route path="permissions" element={<PermissionPage />} />
    </Route>

    </Routes>
 
  );
};

export default OrgRoute;
