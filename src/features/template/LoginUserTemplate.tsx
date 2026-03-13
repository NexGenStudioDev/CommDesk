import SideBar from "../SideBar/v1/Section/SideBar";
import { getTheme } from "../../config/them.config";
import { Outlet } from "react-router";
import BotamNavBar from "../SideBar/v1/Section/BotamNavBar";

const LoginUserTemplate = () => {
  let theme = getTheme("light");

  return (
    <div
      className="dashboard-page flex w-screen min-h-screen overflow-x-hidden items-stretch"
      style={{ background: theme.background.secondary }}
    >
      <SideBar />

      <BotamNavBar />

      <div
        className="dashboard-content flex min-h-screen min-w-0 flex-1 flex-row pb-32 lg:pb-0"
        style={{ background: theme.background.secondary }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default LoginUserTemplate;
