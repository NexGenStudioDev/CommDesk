import { useState } from "react";
import { format } from "date-fns";

import { Calendar } from "@/Component/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/Component/ui/popover";
import { FaRegCalendar } from "react-icons/fa";

type Props = {
  label?: string;
  value?: Date;
  defaultValue?: Date;
  className?: string;
  onChange?: (value: Date | undefined) => void;
};

const Date = ({ label, value, defaultValue, className, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(value ?? defaultValue);

  const handleChange = (selected: Date | undefined) => {
    setDate(selected);
    onChange?.(selected);
    setOpen(false);
  };

  return (
    <div className={`flex flex-col gap-2 ${className || ""}`}>
      {label && <label className="text-sm font-medium text-gray-600">{label}</label>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="w-full flex justify-between items-center gap-4 border rounded-lg px-4 py-3 text-left text-sm hover:bg-gray-50">
            {date ? format(date, "PPP") : "mm/dd/yyyy"}

            <FaRegCalendar className="text-gray-400 inline" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            captionLayout="dropdown"
            ISOWeek={true}
            onSelect={handleChange}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Date;
