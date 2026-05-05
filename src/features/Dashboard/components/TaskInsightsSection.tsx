import TaskOverview from "./TaskOverview";
import RecentTasks from "./RecentTasks";
import { Task } from "../types/dashboard";

interface Props {
  tasks: Task[];
}

export default function TaskInsightsSection({ tasks }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 items-start">
      <TaskOverview tasks={tasks} />
      <RecentTasks tasks={tasks} />
    </div>
  );
}
