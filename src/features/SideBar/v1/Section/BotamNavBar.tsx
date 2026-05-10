import { RiContactsBookFill } from "react-icons/ri";
import { type IconType } from "react-icons";
import { MdDashboard, MdEvent, MdGroup, MdAssignment } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/theme";

type NavItem = {
  icon: IconType;
  text: string;
  link: string;
  isActive: (pathname: string) => boolean;
};

const navItems: NavItem[] = [
  {
    icon: MdDashboard,
    text: "Dashboard",
    link: "/org/dashboard",
    isActive: (p) => p === "/org" || p.startsWith("/org/dashboard"),
  },
  {
    icon: MdGroup,
    text: "Teams",
    link: "/org/member",
    isActive: (p) => p.startsWith("/org/member") || p.startsWith("/org/add-member"),
  },
  {
    icon: MdEvent,
    text: "Events",
    link: "/org/events",
    isActive: (p) => p.startsWith("/org/events") || p.startsWith("/org/create-event"),
  },
  {
    icon: MdAssignment,
    text: "Tasks",
    link: "/org/tasks",
    isActive: (pathname) => pathname.startsWith("/org/tasks"),
  },
  {
    icon: RiContactsBookFill,
    text: "Support",
    link: "/org/contact",
    isActive: (p) => p.startsWith("/org/contact"),
  },
];

const BotamNavBar = () => {
  const { theme } = useTheme();
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[9999] px-3 pb-3 lg:hidden"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
      aria-label="Mobile navigation"
    >
      <div
        className="relative mx-auto flex max-w-md items-center gap-2 overflow-hidden rounded-[30px] px-3 py-3 backdrop-blur-xl"
        style={{
          backgroundColor: theme.bg.surface,
          border: `1px solid ${theme.border.default}`,
          boxShadow: `0 24px 60px -28px ${theme.shadow.md}`,
        }}
      >
        {navItems.map((item) => {
          const active = item.isActive(pathname);
          const Icon = item.icon;

          return (
            <Link
              key={item.text}
              to={item.link}
              aria-current={active ? "page" : undefined}
              className="group relative flex min-w-0 flex-1 items-center justify-center"
            >
              <div
                className="absolute inset-0 rounded-[24px] transition-all duration-200"
                style={{
                  opacity: active ? 1 : 0,
                  backgroundColor: theme.primary.subtle,
                }}
              />

              <div className="relative flex w-full flex-col items-center gap-1.5 rounded-[24px] px-2 py-2.5">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-[16px] border text-xl transition-all duration-200"
                  style={{
                    color: active ? theme.primary.default : theme.text.secondary,
                    borderColor: active ? theme.primary.subtle : theme.border.default,
                    backgroundColor: active ? theme.bg.surface : "transparent",
                    boxShadow: active ? `0 4px 12px ${theme.shadow.sm}` : "none",
                  }}
                >
                  <Icon />
                </div>

                <span
                  className="max-w-full truncate text-[0.7rem] font-semibold tracking-wide transition-colors duration-200"
                  style={{ color: active ? theme.primary.text : theme.text.secondary }}
                >
                  {item.text}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BotamNavBar;
