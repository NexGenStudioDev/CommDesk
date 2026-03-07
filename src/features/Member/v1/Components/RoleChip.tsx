const RoleChip = ({ role }: { role: string }) => {
  const styles = role === "Mentor" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600";

  return <span className={`px-3 py-1 rounded-lg text-xs font-medium ${styles}`}>{role}</span>;
};

export default RoleChip;
