import { useState } from "react";
import { GrGroup } from "react-icons/gr";
import InterestBox from "./InterestBox";
import AREA_OF_INTEREST from "../Constant/Interest.constant";
import { TextArea } from "../../../../Component/ui/TextArea";

const Community_Involvement = () => {
  const [internalNotes, setInternalNotes] = useState("");

  return (
    <div
      className="w-full h-fit flex flex-col rounded-xl self-center mt-10 p-7"
      style={{
        backgroundColor: "var(--cd-surface)",
        border: "1px solid var(--cd-border)",
      }}
    >
      <span
        className="font-extrabold text-xl uppercase mb-[3vh] flex items-center gap-3"
        style={{ color: "var(--cd-text)" }}
      >
        <GrGroup style={{ color: "var(--cd-primary)" }} />
        Community Involvement
      </span>

      <div className="flex flex-col">
        <p className="text-sm uppercase font-semibold" style={{ color: "var(--cd-text-2)" }}>
          Area of Interest
        </p>

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
