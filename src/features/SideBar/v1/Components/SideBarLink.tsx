import React from "react";
import { Link, useLocation } from "react-router";
import { useTheme } from "@/theme";

type SideBarLinkProps = {
  icon: React.ReactNode;
  text: string;
  link?: string;
};

const SideBarLink = ({ icon, text, link = "/" }: SideBarLinkProps) => {
  const { theme } = useTheme();
  const { pathname } = useLocation();
  const isActive = pathname === link || (link !== "/org" && pathname.startsWith(link));

  return (
    <Link
      to={link}
      className="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-150 text-decoration-none"
      style={{
        backgroundColor: isActive ? theme.primary.subtle : "transparent",
        color: isActive ? theme.primary.text : theme.text.secondary,
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLAnchorElement).style.backgroundColor = theme.interactive.hover;
          (e.currentTarget as HTMLAnchorElement).style.color = theme.text.primary;
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
          (e.currentTarget as HTMLAnchorElement).style.color = theme.text.secondary;
        }
      }}
    >
      <div className="flex items-center justify-center text-xl" style={{ minWidth: 24 }}>
        {icon}
      </div>
      <span className="hidden lg:block text-[0.9375rem] font-medium">{text}</span>
    </Link>
  );
};

export default SideBarLink;
