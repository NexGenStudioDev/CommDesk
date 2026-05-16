import { useEffect } from "react";

import { BrowserRouter } from "react-router-dom";

import "./App.css";

import { startAutoUpdater } from "./system/updater/autoUpdater";

import { ThemeProvider } from "./theme";
import OrgRoute from "./routes/OrgRoute";
import MemberRoutes from "./routes/MemberRoutes";

function App() {
  useEffect(() => {
    void startAutoUpdater();
  }, []);

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
