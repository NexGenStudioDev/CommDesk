import React from "react";

type ButtonProps = {
  text: string;
  icon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  width?: string;
  height?: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  className?: string;
};

const Button = ({
  text,
  icon,
  type = "button",
  onClick,
  disabled,
  width,
  height,
  variant = "primary",
  className = "",
}: ButtonProps) => {
  const variantClass = disabled
    ? "bg-[var(--cd-surface-2)] text-[var(--cd-text-muted)] cursor-not-allowed"
    : variant === "secondary"
      ? "cd-btn-secondary"
      : variant === "ghost"
        ? "cd-btn-ghost"
        : variant === "danger"
          ? "cd-btn-danger"
          : "cd-btn-primary";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`cd-btn ${variantClass} ${className}`}
      style={{ width: width || "auto", height: height || "auto" }}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {text}
    </button>
  );
};

export default Button;
