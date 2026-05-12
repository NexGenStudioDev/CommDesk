import { useEffect } from "react";

import { BrowserRouter } from "react-router-dom";

import "./App.css";

import { dashboardData } from "./features/Member/v1/mock/dashboardData";
import { startAutoUpdater } from "./system/updater/autoUpdater";

import { ThemeProvider } from "./theme";
import OrgRoute from "./routes/OrgRoute";
import MemberRoutes from "./routes/MemberRoutes";

function App() {
  useEffect(() => {
    void startAutoUpdater();
  }, []);

  const user = dashboardData.user;
  void user; // used by role-based routing — will be wired to auth context

  return (
    <ThemeProvider>
      <BrowserRouter>

       <OrgRoute />

       <MemberRoutes />
        
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
