import React from "react";
import { FaToggleOn } from "react-icons/fa";

import { RiToggleLine } from "react-icons/ri";

type EventSettingProps = {
  onToggleChange?: (value: boolean) => void;
  isToggled?: boolean;
  title: string;
  description: string;
};

const EventSetting = ({ onToggleChange, isToggled, title, description }: EventSettingProps) => {
  let [toggled, setToggled] = React.useState(isToggled || false);
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    setToggled(isToggled || false);
  }, [isToggled]);

  React.useEffect(() => {
    if (!isAnimating) {
      return;
    }

    const animationTimeout = window.setTimeout(() => {
      setIsAnimating(false);
    }, 180);

    return () => {
      window.clearTimeout(animationTimeout);
    };
  }, [isAnimating]);

  const toggleClassName = `text-[#306ee8] cursor-pointer text-5xl transition-transform duration-200 ease-in ${
    isAnimating ? "scale-110" : "scale-100"
  }`;

  const handleToggle = () => {
    const nextValue = !toggled;
    setToggled(nextValue);
    setIsAnimating(true);
    onToggleChange?.(nextValue);
  };

  return (
    <div className="p-3 flex justify-between">
      <div className="flex flex-col w-[45%]">
        <p className="font-bold text-lg text-gray-800  uppercase  flex items-center justify-between gap-3">
          {/* <IoMdCalendar className="text-[#4f46e5]" /> */}
          {title}
        </p>

        <p className="text-sm text-gray-400 uppercase font-semibold">{description}</p>
      </div>
      <div className="text-5xl">
        {toggled ? (
          <FaToggleOn className={toggleClassName} onClick={handleToggle} />
        ) : (
          <RiToggleLine className={toggleClassName} onClick={handleToggle} />
        )}
      </div>
    </div>
  );
};

export default EventSetting;
