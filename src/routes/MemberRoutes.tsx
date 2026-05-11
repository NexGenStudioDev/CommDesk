import { Route, Routes } from 'react-router-dom'
import LoginPage from '@/features/Auth/v1/Pages/LoginPage'

import SignUpPage from '@/features/Auth/v1/Pages/SignUpPage'

import AnalyticsPage from '@/features/Member/v1/Pages/Analytics'
import DashboardPage from '@/features/Dashboard/Member/v1/Page/DashboardPage'
import MemberLayout from '@/layouts/MemberLayout/MemberLayout'
import NotificationsPage from '@/features/Member/v1/Pages/Notifications'
import SettingsPage from '@/features/Member/v1/Pages/Settings'
import TasksPage from '@/features/Member/v1/Pages/Tasks'
import WorkspacePage from '@/features/Member/v1/Pages/WorkSpace'
import { Contact } from 'lucide-react'
import ViewEvent from '@/features/Events/v1/Pages/ViewEvent'
import BillingPage from '@/features/Member/v1/Pages/Billing'
import MessagesPage from '@/features/Member/v1/Pages/Messages'


const MemberRoutes = () => {
  return (
    <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />

          <Route path="/signup" element={<SignUpPage />} />

         

          {/* Member Routes */}

          <Route path="/member" element={<MemberLayout />}>
            {/* Dashboard */}
            <Route index element={<DashboardPage />} />

            <Route path="dashboard" element={<DashboardPage />} />

            {/* Member Modules */}
            <Route path="analytics" element={<AnalyticsPage />} />

            <Route path="notifications" element={<NotificationsPage />} />

            <Route path="settings" element={<SettingsPage />} />

            <Route path="tasks" element={<TasksPage />} />

            <Route path="workspace" element={<WorkspacePage />} />

            <Route path="messages" element={<MessagesPage />} />

            <Route path="billing" element={<BillingPage />} />

            {/* Events */}
            <Route path="events" element={<ViewEvent />} />

            {/* Contact */}
            <Route path="contact" element={<Contact />} />

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
  )
}

export default MemberRoutes