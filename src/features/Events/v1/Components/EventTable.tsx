import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { Event } from "../Event.type";

type EventProps = {
  events: Event[];
  itemsPerPage: number;
};

const statusStyle: Record<Event["status"], string> = {
  Live: "bg-green-100 text-green-700",
  Upcoming: "bg-blue-100 text-blue-700",
  Completed: "bg-gray-200 text-gray-700",
};

function EventTable({ events, itemsPerPage }: EventProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = events.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = events.slice(indexOfFirstItem, indexOfLastItem);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden h-[63vh] relative">
      <table className="w-full text-sm">
        <thead className="text-gray-500 uppercase text-xs border-b bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left">Name</th>
            <th className="px-6 py-4 text-left">Date</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-left">Teams</th>
            <th className="px-6 py-4 text-left">Submissions</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentItems.map((event) => (
            <tr key={event.id} className="border-b last:border-none hover:bg-gray-50 transition">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl">
                    {event.logo}
                  </div>

                  <div>
                    <p className="font-medium text-gray-800">{event.name}</p>
                    <p className="text-sm text-gray-500">{event.subtitle}</p>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 text-gray-700">{event.date}</td>

              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${statusStyle[event.status]}`}
                >
                  {event.status}
                </span>
              </td>

              <td className="px-6 py-4 text-gray-700">{event.teams}</td>

              <td className="px-6 py-4 text-gray-700">{event.submissions}</td>

              <td className="px-6 py-4 text-right">
                <button className="p-2 rounded-md hover:bg-gray-100">
                  <MoreVertical size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* FOOTER */}
      <div className="flex justify-between items-center px-6 py-4 text-sm text-gray-500 border-t absolute w-full bottom-0 bg-white">
        <p>
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems}{" "}
          results
        </p>

        <div className="flex gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-40"
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventTable;
