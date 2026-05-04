import { Performance } from "../types/dashboard";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  data: Performance;
}

// mock data
const trendData = [
  { day: "Mon", tasks: 2 },
  { day: "Tue", tasks: 4 },
  { day: "Wed", tasks: 3 },
  { day: "Thu", tasks: 5 },
  { day: "Fri", tasks: 6 },
  { day: "Sat", tasks: 4 },
  { day: "Sun", tasks: 3 },
];

export default function PerformanceStats({ data }: Props) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm">
      <h3 className="font-semibold text-lg mb-4">Performance Overview</h3>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="p-3 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-500">Completion Rate</p>
          <p className="text-xl font-semibold text-green-600">{data.completionRate}%</p>
        </div>

        <div className="p-3 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-500">Avg Completion</p>
          <p className="text-xl font-semibold text-indigo-600">{data.avgTime}</p>
        </div>

        <div className="p-3 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-500">Streak</p>
          <p className="text-xl font-semibold text-orange-500">{data.streak} days 🔥</p>
        </div>

        <div className="p-3 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-500">Weekly Done</p>
          <p className="text-xl font-semibold text-blue-600">{data.weeklyCompleted}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <XAxis dataKey="day" fontSize={12} />
            <Tooltip />
            <Line type="monotone" dataKey="tasks" stroke="#6366f1" strokeWidth={3} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
