import { RiContactsBookFill } from "react-icons/ri";
import { type IconType } from "react-icons";
import { MdDashboard, MdEvent, MdGroup, MdAssignment } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { getTheme } from "../../../../config/them.config";

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
    isActive: (pathname) => pathname === "/org" || pathname.startsWith("/org/dashboard"),
  },
  {
    icon: MdGroup,
    text: "Teams",
    link: "/org/member",
    isActive: (pathname) => pathname.startsWith("/org/member") || pathname.startsWith("/org/add-member"),
  },
  {
    icon: MdEvent,
    text: "Events",
    link: "/org/events",
    isActive: (pathname) => pathname.startsWith("/org/events") || pathname.startsWith("/org/create-event"),
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
    isActive: (pathname) => pathname.startsWith("/org/contact"),
  },
];

const BotamNavBar = () => {
  const theme = getTheme("light");
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-9999 px-3 pb-3 lg:hidden"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
      aria-label="Mobile navigation"
    >
      <div
        className="relative mx-auto flex max-w-md items-center gap-2 overflow-hidden rounded-[30px] border px-3 py-3 backdrop-blur-xl"
        style={{
          borderColor: "rgba(255, 255, 255, 0.85)",
          background: `linear-gradient(145deg, rgba(255,255,255,0.94), ${theme.background.secondary})`,
          boxShadow: "0 24px 60px -28px rgba(15, 23, 42, 0.42)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-x-10 top-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(48,110,232,0.45), transparent)",
          }}
        />

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
                className="absolute inset-0 rounded-[24px] border transition-all duration-200"
                style={{
                  opacity: active ? 1 : 0,
                  borderColor: "rgba(48, 110, 232, 0.12)",
                  background:
                    "linear-gradient(180deg, rgba(48,110,232,0.18), rgba(48,110,232,0.06))",
                }}
              />

              <div className="relative flex w-full flex-col items-center gap-1.5 rounded-[24px] px-2 py-2.5">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-[18px] border text-[1.35rem] transition-all duration-200"
                  style={{
                    color: active ? theme.textColor.tersiary : theme.textColor.secondary,
                    borderColor: active ? "rgba(48, 110, 232, 0.18)" : theme.borderColor.primary,
                    background: active ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.58)",
                    boxShadow: active ? "0 18px 26px -22px rgba(48,110,232,0.95)" : "none",
                  }}
                >
                  <Icon />
                </div>

                <span
                  className="max-w-full truncate text-[0.72rem] font-semibold tracking-[0.02em] transition-colors duration-200"
                  style={{
                    color: active ? theme.textColor.primary : theme.textColor.secondary,
                    fontFamily: theme.fontFamily.primary,
                  }}
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
