import { getTheme } from "@/config/them.config";
import ContactHeader from "../Section/ContactHeader";
import InternalDirectoryTable from "../Section/InternalDirectoryTable";
import Support from "../Components/Support";

const Contact = () => {
  let theme = getTheme("light");
  return (
    <div
      className="w-full h-full min-h-0 flex flex-col"
      style={{ background: theme.background.secondary }}
    >
      <ContactHeader />

      <div className="w-full min-h-0 flex flex-col xl:flex-row p-4 sm:p-5 lg:p-6 gap-4 lg:gap-6">
        <div className="w-full min-w-0 xl:flex-1">
          <InternalDirectoryTable />
        </div>

        <div className="w-full min-w-0 xl:max-w-[30rem] flex">
          <Support />
        </div>
      </div>
    </div>
  );
};

export default Contact;
