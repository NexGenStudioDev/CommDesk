import Button from "../../../../Component/ui/Button";
import { Link } from "react-router";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdPublish } from "react-icons/md";

const Event_Header = () => {
  return (
    <div className="py-[3vh] bg-white border-b-[1px] border-gray-300 flex   text-xl font-bold  justify-between">
      <Link to="/member" className="w-1/3 h-full  flex justify-between items-center">
        <h1 className="text-lg sm:text-[2.5vw] lg:text-2xl font-bold text-gray-800  ml-5 mt-2">
          <IoMdArrowRoundBack className="mr-[3vw] inline" />
          Create New Event
        </h1>
      </Link>

      <div className="w-1/2 xl:w-fit h-full mr-[3vw] flex justify-end  gap-5  ">
        <Button
          text="Save Draft"
          onClick={() => alert("Save Draft clicked")}
          backgroundColor="#e5e7eb"
          textColor="#0f172a"
        />

        <Button
          text="Create Event"
          icon={<MdPublish className="inline" />}
          onClick={() => alert("Create Event clicked")}
          backgroundColor="#4f46e4"
        />
      </div>
    </div>
  );
};

export default Event_Header;
