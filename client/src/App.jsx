import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateSurprise from "./pages/CreateSurprise";
import Contribute from "./pages/Contribute";
import SurprisePage from "./pages/SurprisePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateSurprise />} />
        <Route path="/contribute/:code" element={<Contribute />} />
        <Route path="/surprise/:id" element={<SurprisePage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;