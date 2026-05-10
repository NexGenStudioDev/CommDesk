import TaskOverview from "./TaskOverview";
import RecentTasks from "./RecentTasks";

import { Task } from "../types/dashboard";

interface Props {
  tasks: Task[];
}

export default function TaskInsightsSection({ tasks }: Props) {
  return (
    <div
      className="
        grid

        grid-cols-1
        2xl:grid-cols-2

        gap-5
        xl:gap-6

        items-start
      "
    >
      <div className="min-w-0 h-full">
        <TaskOverview tasks={tasks} />
      </div>

      <div className="min-w-0 h-full">
        <RecentTasks tasks={tasks} />
      </div>
    </div>
  );
}
