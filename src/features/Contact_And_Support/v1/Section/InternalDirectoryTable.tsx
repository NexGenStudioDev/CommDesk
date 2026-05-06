import InternalDashboardSearch from "@/features/Contact_And_Support/v1/Components/InternalDashboardSearch";
import InternalSupport_Table from "../Components/InternalSupport_Table";

const InternalDirectoryTable = () => {
  return (
    <div
      className="w-full min-w-0 flex rounded-xl overflow-hidden"
      style={{
        border: "1px solid var(--cd-border)",
        backgroundColor: "var(--cd-surface)",
      }}
    >
      <div className="flex flex-col w-full h-fit">
        <InternalDashboardSearch />
        <InternalSupport_Table />
      </div>
    </div>
  );
};

export default InternalDirectoryTable;
