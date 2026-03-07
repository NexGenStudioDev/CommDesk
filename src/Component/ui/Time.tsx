import { useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/Component/ui/popover";

import { Input } from "./Input";
import { FaRegClock } from "react-icons/fa";

type Props = {
  label?: string;
  value?: string;
  defaultValue?: string;
  className?: string;
  onChange?: (value: string) => void;
};

const Time = ({ label, value, defaultValue, onChange, className }: Props) => {
  const [time, setTime] = useState(value || defaultValue || "");

  const handleChange = (value: string) => {
    setTime(value);
    onChange?.(value);
  };

  return (
    <div className={className || "flex flex-col gap-2"}>
      {label && <label className="text-sm font-medium">{label}</label>}

      <Popover>
        <PopoverTrigger asChild>
          <button className="w-full flex justify-between items-center gap-4 border rounded-lg px-4 py-3 text-left text-sm hover:bg-gray-50">
            {time || "Select time"}

            <FaRegClock className="inline" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-4">
          <Input name="time" type="time" value={time} onChange={handleChange} />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Time;
