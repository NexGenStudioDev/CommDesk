import SideBar from "../SideBar/v1/Section/SideBar";
import { Outlet, redirect } from "react-router";
import BotamNavBar from "../SideBar/v1/Section/BotamNavBar";
import { useAuth } from "../Auth/v1/hooks/useAuth";
import { useMemo } from "react";

const Organisation_Template = () => {
  const { loginMutation } = useAuth();

  useMemo(() => {
    let { data } = loginMutation;

    if (data) {
      let Role = data.role;

      if (Role === "org") {
        redirect("/");
      }
    }
  }, [loginMutation]);

  return (
    <div className="flex w-screen min-h-screen overflow-x-hidden items-stretch cd-page">
      <SideBar />
      <BotamNavBar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-row pb-32 lg:pb-0">
        <Outlet />
      </div>
    </div>
  );
};

export default Organisation_Template;
