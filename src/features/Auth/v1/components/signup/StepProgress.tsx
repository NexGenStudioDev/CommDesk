import { CheckCircle2 } from "lucide-react";

const STEPS = [
  { id: 1, label: "Community" },
  { id: 2, label: "Contact" },
  { id: 3, label: "Socials" },
  { id: 4, label: "Organizer" },
  { id: 5, label: "Review" },
];

interface StepProgressProps {
  current: number;
  total: number;
}

export default function StepProgress({ current, total }: StepProgressProps) {
  return (
    <div className="flex items-center justify-between w-full relative">
      {/* Connector line */}
      <div className="absolute top-[18px] left-0 right-0 h-px bg-gray-200 z-0" />
      <div
        className="absolute top-[18px] left-0 h-px bg-indigo-500 z-0 transition-all duration-500 ease-in-out"
        style={{ width: `${((current - 1) / (total - 1)) * 100}%` }}
      />

      {STEPS.slice(0, total).map((step) => {
        const done = step.id < current;
        const active = step.id === current;
        return (
          <div key={step.id} className="flex flex-col items-center gap-1.5 z-10">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                done
                  ? "bg-indigo-500 border-indigo-500 text-white"
                  : active
                  ? "bg-white border-indigo-500 text-indigo-500 shadow-md shadow-indigo-100"
                  : "bg-white border-gray-200 text-gray-400"
              }`}
            >
              {done ? <CheckCircle2 className="w-4.5 h-4.5" /> : step.id}
            </div>
            <span
              className={`text-xs font-medium inter transition-colors whitespace-nowrap ${
                active ? "text-indigo-600" : done ? "text-gray-600" : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
