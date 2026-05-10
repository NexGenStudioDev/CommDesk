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
    { name: "Todo", value: todo, color: "var(--cd-warning)" },
    { name: "In Progress", value: inProgress, color: "var(--cd-primary)" },
    { name: "Completed", value: completed, color: "var(--cd-success)" },
  ];

  return (
    <div className="cd-card cd-card-hover">
      <h3 className="cd-section-title">Task Overview</h3>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="w-full max-w-[160px] h-[160px] mx-auto sm:mx-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value">
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xs" style={{ color: "var(--cd-text-muted)" }}>
              Total
            </p>
            <p className="text-xl font-bold" style={{ color: "var(--cd-text)" }}>
              {total}
            </p>
          </div>
        </div>

        <div className="space-y-3 w-full">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-sm">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span style={{ color: "var(--cd-text-2)" }}>{item.name}</span>
              <span className="font-semibold ml-auto" style={{ color: "var(--cd-text)" }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
