import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Task } from "../types/dashboard";

interface Props {
  tasks: Task[];
}

export default function TaskOverview({ tasks }: Props) {
  const todo = tasks.filter((t) => t.status === "todo").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const completed = tasks.filter((t) => t.status === "completed").length;

  const total = tasks.length;

  const data = [
    { name: "Todo", value: todo, color: "#facc15" },
    { name: "In Progress", value: inProgress, color: "#60a5fa" },
    { name: "Completed", value: completed, color: "#34d399" },
  ];

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm">
      <h3 className="font-semibold text-lg mb-4">Task Overview</h3>

      <div className="flex items-center gap-6">
        {/* Chart */}
        <div className="w-40 h-40 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value">
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-400">Total</p>
            <p className="text-xl font-bold">{total}</p>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-gray-600">{item.name}</span>
              <span className="text-sm font-semibold ml-auto">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
