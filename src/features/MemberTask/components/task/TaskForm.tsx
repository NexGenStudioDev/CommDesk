import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Task, TaskFormData, TaskPriority } from "../../types/task.types";
import { mockEvents, mockMembers } from "../../mock/taskMock";

interface Props {
  initial?: Task;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function TaskForm({ initial, onSubmit, onCancel, isSubmitting }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>();

  useEffect(() => {
    if (initial) {
      reset({
        title: initial.title,
        description: initial.description,
        priority: initial.priority,
        eventId: initial.eventId,
        assignedTo: initial.assignedTo,
        deadline: initial.deadline,
        tags: initial.tags?.join(", "),
      });
    }
  }, [initial, reset]);

  const priorities: TaskPriority[] = ["low", "medium", "high", "urgent"];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
        <input
          {...register("title", { required: "Title is required" })}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#306ee8]/30 focus:border-[#306ee8]"
          placeholder="Task title"
        />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Description *</label>
        <textarea
          {...register("description", { required: "Description is required" })}
          rows={3}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#306ee8]/30 focus:border-[#306ee8]"
          placeholder="Describe the task..."
        />
        {errors.description && (
          <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Event *</label>
          <select
            {...register("eventId", { required: "Event is required" })}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#306ee8]/30 focus:border-[#306ee8]"
          >
            <option value="">Select event</option>
            {mockEvents.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
          {errors.eventId && <p className="text-xs text-red-500 mt-1">{errors.eventId.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Priority *</label>
          <select
            {...register("priority", { required: true })}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#306ee8]/30 focus:border-[#306ee8]"
          >
            <option value="">Select priority</option>
            {priorities.map((p) => (
              <option key={p} value={p} className="capitalize">{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Assign To *</label>
          <select
            {...register("assignedTo", { required: "Assignee is required" })}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#306ee8]/30 focus:border-[#306ee8]"
          >
            <option value="">Select member</option>
            {mockMembers.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          {errors.assignedTo && (
            <p className="text-xs text-red-500 mt-1">{errors.assignedTo.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Deadline *</label>
          <input
            type="date"
            {...register("deadline", { required: "Deadline is required" })}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#306ee8]/30 focus:border-[#306ee8]"
          />
          {errors.deadline && (
            <p className="text-xs text-red-500 mt-1">{errors.deadline.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Tags <span className="text-gray-400">(comma separated)</span>
        </label>
        <input
          {...register("tags")}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#306ee8]/30 focus:border-[#306ee8]"
          placeholder="frontend, design, api"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2 text-sm font-medium bg-[#306ee8] text-white rounded-lg hover:bg-[#2558c9] disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Saving..." : initial ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  );
}
