import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { Event } from "../Event.type";

type EventProps = {
  events: Event[];
  itemsPerPage: number;
};

const statusConfig: Record<Event["status"], { bg: string; color: string }> = {
  Live: { bg: "var(--cd-success-subtle)", color: "var(--cd-success)" },
  Upcoming: { bg: "var(--cd-primary-subtle)", color: "var(--cd-primary-text)" },
  Completed: { bg: "var(--cd-surface-2)", color: "var(--cd-text-2)" },
};

function EventTable({ events, itemsPerPage }: EventProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(events.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = events.slice(indexOfFirst, indexOfLast);

  return (
    <div
      className="rounded-xl overflow-hidden h-[63vh] relative"
      style={{
        backgroundColor: "var(--cd-surface)",
        border: "1px solid var(--cd-border)",
        boxShadow: "0 1px 3px var(--cd-shadow)",
      }}
    >
      <table className="cd-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Status</th>
            <th>Teams</th>
            <th>Submissions</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((event) => {
            const s = statusConfig[event.status];
            return (
              <tr key={event.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                      style={{
                        backgroundColor: "var(--cd-primary-subtle)",
                        color: "var(--cd-primary)",
                      }}
                    >
                      {event.logo}
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: "var(--cd-text)" }}>
                        {event.name}
                      </p>
                      <p className="text-xs" style={{ color: "var(--cd-text-2)" }}>
                        {event.subtitle}
                      </p>
                    </div>
                  </div>
                </td>
                <td style={{ color: "var(--cd-text-2)" }}>{event.date}</td>
                <td>
                  <span className="cd-badge" style={{ backgroundColor: s.bg, color: s.color }}>
                    {event.status}
                  </span>
                </td>
                <td style={{ color: "var(--cd-text-2)" }}>{event.teams}</td>
                <td style={{ color: "var(--cd-text-2)" }}>{event.submissions}</td>
                <td className="text-right">
                  <button
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: "var(--cd-text-2)" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        "var(--cd-hover)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")
                    }
                  >
                    <MoreVertical size={15} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div
        className="flex justify-between items-center px-6 py-3 text-sm border-t absolute w-full bottom-0"
        style={{
          backgroundColor: "var(--cd-surface)",
          borderColor: "var(--cd-border)",
          color: "var(--cd-text-2)",
        }}
      >
        <p>
          Showing {indexOfFirst + 1}–{Math.min(indexOfLast, events.length)} of {events.length}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="cd-btn cd-btn-secondary px-3 py-1 text-xs disabled:opacity-40"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="cd-btn cd-btn-secondary px-3 py-1 text-xs disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventTable;
