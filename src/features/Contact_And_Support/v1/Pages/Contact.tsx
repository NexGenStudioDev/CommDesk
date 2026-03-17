import { getTheme } from "@/config/them.config";
import ContactHeader from "../Section/ContactHeader";
import InternalDirectoryTable from "../Section/InternalDirectoryTable";
import Support from "../Components/Support";

const Contact = () => {
  let theme = getTheme("light");
  return (
    <div className="w-full h-full flex flex-col" style={{ background: theme.background.secondary }}>
      <ContactHeader />

      <div className="w-full flex p-[3vw] gap-[3vw]">
        <div className=" flex flex-col">
          <InternalDirectoryTable />
        </div>

        <div className="w-full h-full flex items-center  justify-center ">
          <Support />
        </div>
      </div>
    </div>
  );
};

export default Contact;
