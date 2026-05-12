import { Route, Routes } from "react-router";
import AddMemberPage from "@/features/AddMember/v1/Page/AddMemberPage";
import Contact from "@/features/Contact_And_Support/v1/Pages/Contact";
import DashBoardPage from "@/features/Dashboard/Organisation/v1/Pages/DashBoardPage";
import CreateNewEvent from "@/features/Events/v1/Pages/CreateNewEvent";
import ViewEvent from "@/features/Events/v1/Pages/ViewEvent";
import MemberPage from "@/features/Member/v1/Pages/MemberPage";
import ProjectsPage from "@/features/Projects/Pages/ProjectsPage";
import Organisation_Template from "@/features/template/LoginUserTemplate";
import CreateTaskPage from "@/features/Tasks/v1/pages/CreateTaskPage";
import EditTaskPage from "@/features/Tasks/v1/pages/EditTaskPage";
import TaskDetailPage from "@/features/Tasks/v1/pages/TaskDetailPage";
import TaskManagementPage from "@/features/Tasks/v1/pages/TaskManagementPage";

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

      <Route path="tasks" element={<TaskManagementPage />} />
      <Route path="tasks/create" element={<CreateTaskPage />} />
      <Route path="tasks/:taskId" element={<TaskDetailPage />} />
      <Route path="tasks/:taskId/edit" element={<EditTaskPage />} />

      {/* Contact */}
      <Route path="contact" element={<Contact />} />

      {/* Add Member */}
      <Route path="add-member" element={<AddMemberPage />} />
    </Route>

    </Routes>
 
  );
};

export default OrgRoute;
