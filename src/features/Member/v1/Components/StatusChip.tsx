const StatusChip = ({ status }: { status: string }) => {
  const styles =
    status === "Active"
      ? "bg-green-100 text-green-600"
      : status === "Inactive"
        ? "bg-gray-100 text-gray-600"
        : status === "Pending"
          ? "bg-yellow-100 text-yellow-600"
          : status === "On Boarding"
            ? "bg-yellow-200 text-yellow-800"
            : status === "Banned"
              ? "bg-red-100 text-red-600"
              : "bg-gray-100 text-gray-600";

  return <span className={`px-3 py-1 rounded-lg text-xs font-medium ${styles}`}>{status}</span>;
};

export default StatusChip;
