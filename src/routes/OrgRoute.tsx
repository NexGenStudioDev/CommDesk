import { Suspense, lazy } from "react";
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

import ProtectedRoute from "./ProtectedRoute";
import { dashboardData } from "@/features/Member/v1/mock/dashboardData";

// Lazy-loaded Webhook pages
const WebhookListPage = lazy(() => import("@/features/Webhooks/v1/pages/WebhookListPage"));
const CreateWebhookPage = lazy(() => import("@/features/Webhooks/v1/pages/CreateWebhookPage"));
const EditWebhookPage = lazy(() => import("@/features/Webhooks/v1/pages/EditWebhookPage"));
const WebhookDetailsPage = lazy(() => import("@/features/Webhooks/v1/pages/WebhookDetailsPage"));
const WebhookLogsPage = lazy(() => import("@/features/Webhooks/v1/pages/WebhookLogsPage"));

// Lazy-loaded Billing pages
const CommunityWalletPage = lazy(() => import("@/features/Billing/v1/pages/CommunityWalletPage"));
const UsageDashboardPage = lazy(() => import("@/features/Billing/v1/pages/UsageDashboardPage"));
const AddFundsPage = lazy(() => import("@/features/Billing/v1/pages/AddFundsPage"));
const BillingPage = lazy(() => import("@/features/Member/v1/Pages/Billing"));

const OrgRoute = () => {
  return (
    <Suspense
      fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}
    >
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

          {/* Webhooks */}
          <Route
            path="dashboard/webhooks/*"
            element={
              <ProtectedRoute
                user={dashboardData.user}
                allowedRoles={["CommunityOwner", "Admin", "Organizer"]}
              >
                <Routes>
                  <Route index element={<WebhookListPage />} />
                  <Route path="create" element={<CreateWebhookPage />} />
                  <Route path=":id" element={<WebhookDetailsPage />} />
                  <Route path=":id/edit" element={<EditWebhookPage />} />
                  <Route path=":id/logs" element={<WebhookLogsPage />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Community Wallet */}
          <Route path="billing/wallet" element={<CommunityWalletPage />} />

          {/* Usage Dashboard */}
          <Route path="billing/usage" element={<UsageDashboardPage />} />

          {/* Billing Hub + Add Funds */}
          <Route path="billing" element={<BillingPage />} />
          <Route path="billing/add-funds" element={<AddFundsPage />} />

          {/* Contact */}
          <Route path="contact" element={<Contact />} />

          {/* Add Member */}
          <Route path="add-member" element={<AddMemberPage />} />
        </Route>
        {/* Fallback route to suppress "No routes matched location" warning on non-org paths */}
        <Route path="*" element={null} />
      </Routes>
    </Suspense>
  );
};

export default OrgRoute;
