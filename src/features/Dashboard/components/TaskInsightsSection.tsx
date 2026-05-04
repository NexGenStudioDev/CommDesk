import TaskOverview from "./TaskOverview";
import RecentTasks from "./RecentTasks";
import { Task } from "../types/dashboard";

interface Props {
  tasks: Task[];
}

export default function TaskInsightsSection({ tasks }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <TaskOverview tasks={tasks} />
      <RecentTasks tasks={tasks} />
    </div>
  );
}
