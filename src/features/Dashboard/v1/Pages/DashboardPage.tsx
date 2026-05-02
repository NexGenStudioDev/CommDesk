import DashboardLayout from "../layout/DashboardLayout";
import SummarySection from "../components/SummarySection";
import TaskSection from "../components/TaskSection";
import UrgentTasksSection from "../components/UrgentTaskSection";
import { mockTasks } from "../mock/DashboardMock";
import Card from "../components/Card";
import ActivityFeed from "../components/ActivityFeed";
import { mockActivities } from "../mock/ActivityMock";
import PerformanceSection from "../components/PerformanceSection";
import AchievementsSection from "../components/AchievementSection";
import { mockAchievements } from "../mock/AchievementMock";
import IssuesSection from "../components/IssueSection";
import RewardsSection from "../components/RewardSection";
import { mockIssues } from "../mock/IssueMock";
import { mockRewards } from "../mock/RewardsMock";
import CommunitySection from "../components/CommunitySection";
import { mockCommunity } from "../mock/CommunityMock";
import CalendarSection from "../components/CalendarSection.tsx";
import { mockCalendar } from "../mock/CalendarMock.ts";
import AISuggestionsSection from "../components/AISuggestionsSection";
import ProductivitySection from "../components/ProductivitySection";

export default function DashboardPage() {
  const now = new Date();

  // 📊 Monthly performance
  const totalTasks = mockTasks.length;

  const completedThisMonth = mockTasks.filter((task) => {
    if (task.status !== "completed" || !task.completedAt) return false;

    const completedDate = new Date(task.completedAt);

    return (
      completedDate.getMonth() === now.getMonth() &&
      completedDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const performanceData = {
    totalTasks,
    completedTasks: completedThisMonth,
    avgCompletionTime: "2.3 days",
    streak: 5,
  };

  return (
    <DashboardLayout>
      {/* 🔝 Summary */}
      <SummarySection tasks={mockTasks} />

      {/* 🧱 Main Layout */}
      <div className="dashboard-grid">
        {/* LEFT COLUMN (Insights) */}
        <div className="dashboard-column">
          <Card>
            <AISuggestionsSection tasks={mockTasks} />
          </Card>
          <Card>
            <UrgentTasksSection tasks={mockTasks} />
          </Card>
          <Card>
            <ActivityFeed activities={mockActivities} />
          </Card>

          <Card>
            <IssuesSection issues={mockIssues} />
          </Card>

          <Card>
            <RewardsSection data={mockRewards} />
          </Card>

          <Card>
            <CalendarSection items={mockCalendar} />
          </Card>
        </div>

        {/* RIGHT COLUMN (Action + Planning) */}
        <div className="dashboard-column">
          {/* 🔥 Priority First */}

          <Card>
            <TaskSection tasks={mockTasks} />
          </Card>
          <Card>
            <PerformanceSection data={performanceData} />
          </Card>
          <Card>
            <AchievementsSection achievements={mockAchievements} />
          </Card>
          <Card>
            <CommunitySection data={mockCommunity} />
          </Card>
          <Card>
            <ProductivitySection tasks={mockTasks} />
          </Card>
        </div>
      </div>

      {/* 🎨 Responsive Layout */}
      <style>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        .dashboard-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        @media (min-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1fr 1.25fr;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
