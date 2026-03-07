import { useState } from "react";
import { getTheme } from "../../../../config/them.config";
import { GrGroup } from "react-icons/gr";
import InterestBox from "./InterestBox";
import AREA_OF_INTEREST from "../Constant/Interest.constant";
import { TextArea } from "../../../../Component/ui/TextArea";

const Community_Involvement = () => {
  let theme = getTheme("light");
  const [internalNotes, setInternalNotes] = useState("");

  return (
    <div
      className="bg-white w-full h-fit flex flex-col border-2 rounded-lg self-center mt-10 p-7"
      style={{
        backgroundColor: theme.background.primary,
        borderColor: theme.borderColor.primary,
      }}
    >
      <span className="font-extrabold text-xl text-gray-800 uppercase mb-[3vh] flex items-center gap-3">
        <GrGroup className="text-[#4f46e5]" />
        Community Involvement
      </span>

      <div className="flex flex-col">
        <p className="text-md text-gray-400 uppercase font-semibold">Area of Interest</p>

        <div className="flex flex-wrap gap-4 mt-3">
          {AREA_OF_INTEREST.map((interest, index) => (
            <InterestBox key={index} label={interest} isChecked={false} onClick={() => {}} />
          ))}
        </div>

        <TextArea
          label="Internal Notes"
          name="internalNotes"
          placeholder="Enter internal notes"
          value={internalNotes}
          onChange={(_, value) => setInternalNotes(value)}
          className="mt-[3vh]"
          rows={5}
        />
      </div>
    </div>
  );
};

export default Community_Involvement;
