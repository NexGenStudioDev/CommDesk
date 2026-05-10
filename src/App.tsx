import { useEffect } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";



import DashboardPage from "./features/Dashboard/member/v1/Pages/DashboardPage";

import MemberPage from "./features/Member/v1/Pages/MemberPage";

import MemberLayout from "./layouts/MemberLayout";

import AddMemberPage from "./features/AddMember/v1/Page/AddMemberPage";

import CreateNewEvent from "./features/Events/v1/Pages/CreateNewEvent";

import Contact from "./features/Contact_And_Support/v1/Pages/Contact";

import ViewEvent from "./features/Events/v1/Pages/ViewEvent";
import LoginPage from "./features/Auth/v1/Pages/LoginPage";

import SignUpPage from "./features/Auth/v1/Pages/SignUpPage";

import AnalyticsPage from "./features/Dashboard/member/v1/Pages/Analytics";

import NotificationsPage from "./features/Dashboard/member/v1/Pages/Notifications";

import SettingsPage from "./features/Dashboard/member/v1/Pages/Settings";

import TasksPage from "./features/Dashboard/member/v1/Pages/Tasks";

import TeamsPage from "./features/Dashboard/member/v1/Pages/Teams";

import WorkspacePage from "./features/Dashboard/member/v1/Pages/WorkSpace";

import MessagesPage from "./features/Dashboard/member/v1/Pages/Messages";

import BillingPage from "./features/Dashboard/member/v1/Pages/Billing";
import { dashboardData } from "./features/Dashboard/member/mock/dashboardData";
import { startAutoUpdater } from "./system/updater/autoUpdater";

import ProtectedRoute from "./routes/ProtectedRoute";

import { ThemeProvider } from "next-themes";

import Organisation_Template from "./features/template/LoginUserTemplate";




function App() {
  useEffect(() => {
    void startAutoUpdater();
  }, []);

  const user = dashboardData.user;

  return (
    <ThemeProvider attribute="class" defaultTheme="light">

    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />

        <Route path="/signup" element={<SignUpPage />} />

        {/* Member Routes */}
     


         <Route path="/org" element={<Organisation_Template />}>
          {/* Dashboard */}
          <Route
            index
            element={
              <ProtectedRoute user={user} allowedRoles={["Member"]}>
                <DashboardPage />
              </ProtectedRoute>
            }
            />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute user={user} allowedRoles={["Member"]}>
                <DashboardPage />
              </ProtectedRoute>
            }
            />

          {/* Member Profile */}
          <Route path="profile" element={<MemberPage />} />

          {/* Member Modules */}
          <Route path="analytics" element={<AnalyticsPage />} />

          <Route path="notifications" element={<NotificationsPage />} />

          <Route path="settings" element={<SettingsPage />} />

          <Route path="tasks" element={<TasksPage />} />

          <Route path="teams" element={<TeamsPage />} />

          <Route path="workspace" element={<WorkspacePage />} />

          <Route path="messages" element={<MessagesPage />} />

          <Route path="billing" element={<BillingPage />} />

          {/* Events */}
          <Route path="events" element={<ViewEvent />} />

          <Route path="create-event" element={<CreateNewEvent />} />

          {/* Contact */}
          <Route path="contact" element={<Contact />} />

          {/* Add Member */}
          <Route path="add-member" element={<AddMemberPage />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div
                className="
                  flex items-center justify-center

                  h-[60vh]

                  text-xl font-semibold

                  text-gray-500
                  dark:text-zinc-400
                "
              >
                404 Not Found
              </div>
            }
          />
        </Route>


           <Route path="/member" element={<MemberLayout />}>
          {/* Dashboard */}
          <Route
            index
            element={
              <ProtectedRoute user={user} allowedRoles={["Member"]}>
                <DashboardPage />
              </ProtectedRoute>
            }
            />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute user={user} allowedRoles={["Member"]}>
                <DashboardPage />
              </ProtectedRoute>
            }
            />

          {/* Member Profile */}
          <Route path="profile" element={<MemberPage />} />

          {/* Member Modules */}
          <Route path="analytics" element={<AnalyticsPage />} />

          <Route path="notifications" element={<NotificationsPage />} />

          <Route path="settings" element={<SettingsPage />} />

          <Route path="tasks" element={<TasksPage />} />

          <Route path="teams" element={<TeamsPage />} />

          <Route path="workspace" element={<WorkspacePage />} />

          <Route path="messages" element={<MessagesPage />} />

          <Route path="billing" element={<BillingPage />} />

          {/* Events */}
          <Route path="events" element={<ViewEvent />} />

        

          {/* Contact */}
          <Route path="contact" element={<Contact />} />

          {/* Add Member */}
          <Route path="add-member" element={<AddMemberPage />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div
                className="
                  flex items-center justify-center

                  h-[60vh]

                  text-xl font-semibold

                  text-gray-500
                  dark:text-zinc-400
                "
              >
                404 Not Found
              </div>
            }
          />
        </Route>

        {/* Unauthorized */}
        <Route
          path="/unauthorized"
          element={
            <div
              className="
                flex items-center justify-center

                h-screen

                text-xl font-semibold

                text-red-500
              "
            >
              Unauthorized Access
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
            </ThemeProvider>
  );
}

export default App;
