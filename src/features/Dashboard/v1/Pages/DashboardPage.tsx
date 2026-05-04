import { useDashboardData } from "../../hooks/useDashboardData";

import SummaryCard from "../../components/SummaryCard";
import ActivityFeed from "../../components/ActivityFeed";
import PerformanceStats from "../../components/PerformanceStats";
import TaskInsightsSection from "../../components/TaskInsightsSection";
import UpcomingUrgentTasks from "../../components/UpcomingUrgentTasks";

import Achievements from "@/features/Dashboard/components/Achievements";
import IssuesPanel from "@/features/Dashboard/components/IssuesPanel";
import BudgetCard from "@/features/Dashboard/components/BudgetCard";
import DashboardLayout from "../../layouts/DashboardLayout";
import CommunityStatsCard from "@/features/Dashboard/components/CommunityStats";
import CalendarWidget from "@/features/Dashboard/components/CalendarWidget";
import ProductivityScore from "@/features/Dashboard/components/ProductivityScore";
import SmartReminders from "@/features/Dashboard/components/SmartReminders";
import AISuggestions from "@/features/Dashboard/components/AISuggestions";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error loading dashboard
      </div>
    );
  }

  if (data.user.role !== "Member") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
          <p className="text-lg font-semibold mb-2">Access Restricted</p>
          <p className="text-sm text-gray-500">This dashboard is only available for members.</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Welcome back, {data.user.name.split(" ")[0]} 👋
            </h1>
            <p className="text-sm text-gray-500">Here’s what’s happening today</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <SummaryCard title="Total Tasks" value={data.summary.total} color="purple" />
          <SummaryCard title="Completed" value={data.summary.completed} color="green" />
          <SummaryCard title="Upcoming" value={data.summary.upcoming} color="blue" />
          <SummaryCard title="Urgent" value={data.summary.urgent} color="red" />
          <SummaryCard title="In Progress" value={data.summary.inProgress} color="yellow" />
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-5 items-start">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-5">
            <TaskInsightsSection tasks={data.tasks || []} />

            <SmartReminders tasks={data.tasks || []} />
            <AISuggestions tasks={data.tasks || []} />

            <ActivityFeed activities={data.activity || []} />

            <CalendarWidget data={data.calendar} />

            <BudgetCard data={data.rewards} />
          </div>

          {/* RIGHT */}
          <div className="space-y-5 self-start">
            <UpcomingUrgentTasks tasks={data.tasks || []} />

            <PerformanceStats data={data.performance} />

            <IssuesPanel data={data.issues} />

            <CommunityStatsCard data={data.community} />

            <ProductivityScore data={data.performance} />

            <Achievements data={data.achievements} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
