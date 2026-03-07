import Button from "@/Component/ui/Button";

import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Event_View_Header = () => {
  const navigate = useNavigate();

  return (
    <div className="py-[3vh] bg-white border-b-[1px] border-gray-300 flex  flex-col text-xl font-bold  justify-between">
      <div className="flex w-full justify-between items-start">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-800  ml-5 ">Events</h1>
          <p className="text-[0.9vw] text-gray-500 ml-5 mt-1">
            Manage all your events in one place. Create, edit, and track event details with ease.
          </p>
        </div>
        <div className="flex items-center mr-[2vw]">
          <Button
            text="Create Event"
            onClick={() => navigate("/create-event")}
            backgroundColor="#4f46e4"
            icon={<IoMdAdd />}
          />
        </div>
      </div>

      <div className=""></div>
    </div>
  );
};

export default Event_View_Header;
