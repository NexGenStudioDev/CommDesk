import { useState } from "react";
import { GrGroup } from "react-icons/gr";
import InterestBox from "./InterestBox";
import AREA_OF_INTEREST from "../Constant/Interest.constant";
import { TextArea } from "../../../../Component/ui/TextArea";
import { useFormContext } from "react-hook-form";
import type { MemberFormValues } from "../Validator/AddMember.Validator";

const Community_Involvement = () => {
  const { watch, setValue, formState } = useFormContext<MemberFormValues>();

  const { errors } = formState;

  const [internalNotes, setInternalNotes] = useState(watch("internalNotes") ?? "");
  const areaOfInterest = watch("areaOfInterest") ?? [];

  const toggleInterest = (interest: string, isChecked: boolean) => {
    const nextInterests = isChecked
      ? [...areaOfInterest, interest]
      : areaOfInterest.filter((value) => value !== interest);

    setValue("areaOfInterest", nextInterests, { shouldDirty: true });
  };

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
            <InterestBox
              key={index}
              label={interest}
              isChecked={areaOfInterest.includes(interest)}
              onClick={(clicked) => toggleInterest(interest, clicked)}
            />
          ))}
        </div>

        <TextArea
          label="Internal Notes"
          name="internalNotes"
          placeholder="Enter internal notes"
          value={internalNotes}
          error={errors.internalNotes?.message}
          onChange={(_, value) => {
            setInternalNotes(value);
            setValue("internalNotes", value, { shouldDirty: true });
          }}
          className="mt-[3vh]"
          rows={5}
        />
      </div>
    </div>
  );
};

export default Community_Involvement;
