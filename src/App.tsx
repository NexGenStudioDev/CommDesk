import { useEffect } from "react";

import { BrowserRouter } from "react-router-dom";

import DashboardPage from "./features/Dashboard/v1/Pages/DashboardPage";
import MemberPage from "./features/Member/v1/Pages/MemberPage";
import LoginUserTemplate from "./features/template/LoginUserTemplate";
import AddMemberPage from "./features/AddMember/v1/Page/AddMemberPage";
import CreateNewEvent from "./features/Events/v1/Pages/CreateNewEvent";
import Contact from "./features/Contact_And_Support/v1/Pages/Contact";
import ViewEvent from "./features/Events/v1/Pages/ViewEvent";
import LoginPage from "./features/Auth/v1/Pages/LoginPage";
import SignUpPage from "./features/Auth/v1/Pages/SignUpPage";
import TaskListPage from "./features/MemberTask/pages/TaskListPage";
import TaskDetailPage from "./features/MemberTask/pages/TaskDetailPage";
import CreateTaskPage from "./features/MemberTask/pages/CreateTaskPage";
import EditTaskPage from "./features/MemberTask/pages/EditTaskPage";
import ProjectDetailPage from "./features/ProjectDetail/pages/ProjectDetailPage";
import { PermissionProvider } from "./features/MemberTask/context/PermissionContext";
import "./App.css";

import { dashboardData } from "./features/Member/v1/mock/dashboardData";
import { startAutoUpdater } from "./system/updater/autoUpdater";

import { ThemeProvider } from "next-themes";
import OrgRoute from "./routes/OrgRoute";
import MemberRoutes from "./routes/MemberRoutes";

function App() {
  useEffect(() => {
    void startAutoUpdater();
  }, []);

  const user = dashboardData.user;

  return (
    <PermissionProvider>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Protected / Org Layout */}
        <Route path="/org" element={<LoginUserTemplate />}>
          {/* Protected Dashboard */}
          <Route
            index
            element={
              <ProtectedRoute user={user} allowedRoles={["Member", "Admin"]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute user={user} allowedRoles={["Member", "Admin"]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Other routes (not restricted) */}
          <Route path="member" element={<MemberPage />} />
          <Route path="add-member" element={<AddMemberPage />} />
          <Route path="events" element={<ViewEvent />} />
          <Route path="create-event" element={<CreateNewEvent />} />
          <Route path="contact" element={<Contact />} />

          {/* Task System */}
          <Route path="tasks" element={<TaskListPage />} />
          <Route path="tasks/create" element={<CreateTaskPage />} />
          <Route path="tasks/:taskId" element={<TaskDetailPage />} />
          <Route path="tasks/:taskId/edit" element={<EditTaskPage />} />

          {/* Project System */}
          <Route path="projects/:projectId" element={<ProjectDetailPage />} />

          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>

        <Route
          path="/unauthorized"
          element={
            <div className="flex items-center justify-center h-screen text-red-500 text-xl">
              Unauthorized Access
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
    </PermissionProvider>
    <ThemeProvider attribute="class" defaultTheme="light">
      <BrowserRouter>

       <OrgRoute />

       <MemberRoutes />
        
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
