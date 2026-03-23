import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardUnlocked from "./pages/DashboardUnlocked";
import CreateSurprise from "./pages/CreateSurprise";
import Contribute from "./pages/Contribute";
import SurprisePage from "./pages/SurprisePage";
import TimelinePage from "./pages/TimelinePage";
import LettersPage from "./pages/LettersPage";
import GalleryPage from "./pages/GalleryPage";
import VideoPage from "./pages/VideoPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard-unlocked" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard-unlocked/:surpriseId" element={<DashboardUnlocked />} />
        <Route path="/timeline/:surpriseId" element={<TimelinePage />} />
        <Route path="/letters/:surpriseId" element={<LettersPage />} />
        <Route path="/gallery/:surpriseId" element={<GalleryPage />} />
        <Route path="/videos/:surpriseId" element={<VideoPage />} />
        <Route path="/create" element={<CreateSurprise />} />
        <Route path="/contribute/:code" element={<Contribute />} />
        <Route path="/surprise/:id" element={<SurprisePage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;