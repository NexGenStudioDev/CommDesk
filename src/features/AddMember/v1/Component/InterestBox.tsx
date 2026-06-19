import React from "react";
import { TiTick } from "react-icons/ti";

type InterestBoxProps = {
  isChecked: boolean;
  label: string;
  onClick: (clicked: boolean) => void;
};

const InterestBox = (props: InterestBoxProps) => {
  const [Clicked, setClicked] = React.useState(props.isChecked);

  return (
    <div
      className={`InterestBox flex p-3 font-bold ${
        Clicked
          ? "bg-blue-100 border-blue-500 text-blue-600"
          : "bg-[cd-surface] border-gray-300 text-[--cd-text)"
      } border rounded-lg cursor-pointer`}
      onClick={() => {
        props.onClick(!Clicked);
        setClicked(!Clicked);
      }}
    >
      <div
        className={`rounded-md border-2 w-6 h-6  flex items-center justify-center ${
          Clicked ? "border-blue-500 bg-blue-500" : "border-[var(cd-border-subtle)] bg-transparent"
        }`}
      >
        {Clicked && <TiTick className="text-white text-lg" />}
      </div>

      <div className="ml-3">{props.label}</div>
    </div>
  );
};

export default InterestBox;
