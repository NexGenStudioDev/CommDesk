import React from "react";

type ButtonProps = {
  text: string;
  icon?: React.ReactNode;
  width?: string;
  height?: string;
  onClick: () => void;
  textColor?: string;
  disabled?: boolean;
  backgroundColor?: string;
};

const Button = ({
  text,
  textColor,
  icon,
  onClick,
  disabled,
  width,
  backgroundColor,
  height,
}: ButtonProps) => {
  return (
    <div className="text-sm lg:text-[1vw]">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`px-5 py-3 rounded-lg flex items-center ${disabled ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
        style={{
          width: width || "auto",
          height: height || "auto",
          backgroundColor: backgroundColor || undefined,
          color: textColor || undefined,
        }}
      >
        {icon && <span className="Icon mr-2 inline h-fit w-fit">{icon}</span>}
        {text}
      </button>
    </div>
  );
};

export default Button;
