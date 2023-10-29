import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { themeSettings } from "./theme";
import Layout from "./scenes/layout/Layout";
import Dashboard from "./scenes/dashboard/Dashboard";
import AddTutor from "./scenes/tutor/AddTutor";
import AllTutors from "./scenes/tutor/AllTutors";
import TutorProfile from "./scenes/tutor/TutorProfile";
import AddOffer from "./scenes/offer/AddOffer";
import AvailableOffers from "./scenes/offer/AvailableOffers";
import AvailableOfferMatchedTutor from "./scenes/offer/AvailableOfferMatchedTutor";
import PendingOffers from "./scenes/offer/PendingOffers";
import ConfirmedOffers from "./scenes/offer/ConfirmedOffers";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/addtutor" element={<AddTutor />} />
              <Route path="/alltutors" element={<AllTutors />} />
              <Route path="/tutorprofile/:id" element={<TutorProfile />} />
              <Route path="/addoffer" element={<AddOffer />} />
              <Route path="/availableoffers" element={<AvailableOffers />} />
              <Route
                path="/availableoffer/:id"
                element={<AvailableOfferMatchedTutor />}
              />
              <Route path="/pendingoffers" element={<PendingOffers />} />
              <Route path="/confirmedoffers" element={<ConfirmedOffers />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
