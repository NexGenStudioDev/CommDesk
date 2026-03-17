import { getTheme } from "@/config/them.config";
import InternalDashboardSearch from "@/features/Contact_And_Support/v1/Components/InternalDashboardSearch";
import InternalSupport_Table from "../Components/InternalSupport_Table";

const InternalDirectoryTable = () => {
  let theme = getTheme("light");

  return (
    <div
      className="w-[90vw] lg:w-[50vw] flex h-full rounded-xl border-2"
      style={{ borderColor: theme.borderColor.primary }}
    >
      <div className="flex flex-col w-full h-fit">
        <InternalDashboardSearch />

        <InternalSupport_Table />
      </div>
    </div>
  );
};

export default InternalDirectoryTable;
