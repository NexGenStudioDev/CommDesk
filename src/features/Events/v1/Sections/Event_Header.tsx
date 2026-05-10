import Button from "../../../../Component/ui/Button";
import { Link } from "react-router";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdPublish } from "react-icons/md";

const Event_Header = () => {
  return (
    <div
      className="py-[3vh] border-b flex text-xl font-bold justify-between"
      style={{
        backgroundColor: "var(--cd-surface)",
        borderColor: "var(--cd-border)",
      }}
    >
      <Link to="/org/events" className="w-1/3 h-full flex items-center">
        <h1
          className="text-lg sm:text-[2.5vw] lg:text-2xl font-bold ml-5 mt-2"
          style={{ color: "var(--cd-text)" }}
        >
          <IoMdArrowRoundBack className="mr-[3vw] inline" />
          Create New Event
        </h1>
      </Link>

      <div className="w-1/2 xl:w-fit h-full mr-[3vw] flex justify-end gap-3">
        <Button text="Save Draft" variant="secondary" onClick={() => alert("Save Draft clicked")} />
        <Button
          text="Create Event"
          icon={<MdPublish className="inline" />}
          onClick={() => alert("Create Event clicked")}
        />
      </div>
    </div>
  );
};

export default Event_Header;
