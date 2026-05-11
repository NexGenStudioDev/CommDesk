import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { startAutoUpdater } from "./system/updater/autoUpdater";
import { ThemeProvider } from "next-themes";
import OrgRoute from "./routes/OrgRoute";
import MemberRoutes from "./routes/MemberRoutes";

function App() {
  useEffect(() => {
    void startAutoUpdater();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <BrowserRouter>
        <OrgRoute />
        <MemberRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
