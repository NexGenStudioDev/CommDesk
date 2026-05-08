import { useDashboardData } from "../../hooks/useDashboardData";

import SummaryCard from "../../components/SummaryCard";
import ActivityFeed from "../../components/ActivityFeed";
import PerformanceStats from "../../components/PerformanceStats";
import UpcomingUrgentTasks from "../../components/UpcomingUrgentTasks";
import TaskOverview from "../../components/TaskOverview";
import RecentTasks from "../../components/RecentTasks";

import Achievements from "@/features/Dashboard/components/Achievements";
import IssuesPanel from "@/features/Dashboard/components/IssuesPanel";
import BudgetCard from "@/features/Dashboard/components/BudgetCard";
import CommunityStatsCard from "@/features/Dashboard/components/CommunityStats";
import CalendarWidget from "@/features/Dashboard/components/CalendarWidget";
import ProductivityScore from "@/features/Dashboard/components/ProductivityScore";
import SmartReminders from "@/features/Dashboard/components/SmartReminders";
import AISuggestions from "@/features/Dashboard/components/AISuggestions";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) {
    return (
      <div
        className="
          flex items-center justify-center
          min-h-screen

          text-gray-700
          dark:text-zinc-300
        "
      >
        Loading...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        className="
          flex items-center justify-center
          min-h-screen

          text-red-500
        "
      >
        Error loading dashboard
      </div>
    );
  }

  return (
    // <DashboardLayout>
    <div className="space-y-5 w-full">
      {/* Header */}
      <div
        className="
            flex flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between

            gap-2
          "
      >
        <div>
          <h1
            className="
                text-lg
                sm:text-xl
                md:text-2xl

                font-semibold

                text-gray-800
                dark:text-white
              "
          >
            Welcome back, {data.user.name.split(" ")[0]} 👋
          </h1>

          <p
            className="
                text-sm

                text-gray-500
                dark:text-zinc-400
              "
          >
            Here’s what’s happening today
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div
        className="
            grid

            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-5

            gap-4

            w-full
          "
      >
        <SummaryCard title="Total Tasks" value={data.summary.total} color="purple" />

        <SummaryCard title="Completed" value={data.summary.completed} color="green" />

        <SummaryCard title="Upcoming" value={data.summary.upcoming} color="blue" />

        <SummaryCard title="Urgent" value={data.summary.urgent} color="red" />

        <SummaryCard title="In Progress" value={data.summary.inProgress} color="yellow" />
      </div>

      {/* Main Grid */}
      <div
        className="
            grid
            grid-cols-1
            xl:grid-cols-3

            gap-5

            items-start
            w-full
          "
      >
        {/* LEFT */}
        <div
          className="
              xl:col-span-2

              space-y-5
              w-full
            "
        >
          {/* Top Section */}
          <div
            className="
                grid
                grid-cols-1
                md:grid-cols-2

                gap-5
              "
          >
            <TaskOverview tasks={data.tasks || []} />

            <RecentTasks tasks={data.tasks || []} />
          </div>

          <SmartReminders tasks={data.tasks || []} />

          <AISuggestions tasks={data.tasks || []} />

          <ActivityFeed activities={data.activity || []} />

          <CalendarWidget data={data.calendar} />

          <BudgetCard data={data.rewards} />
        </div>

        {/* RIGHT */}
        <div className="space-y-5 w-full">
          <UpcomingUrgentTasks tasks={data.tasks || []} />

          <PerformanceStats data={data.performance} />

          <IssuesPanel data={data.issues} />

          <CommunityStatsCard data={data.community} />

          <ProductivityScore data={data.performance} />

          <Achievements data={data.achievements} />
        </div>
      </div>
    </div>
    //</DashboardLayout>
  );
}
