import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/registration/Register";
import Home from "./components/Home";
import Verify from "./components/registration/Verify";
import "leaflet/dist/leaflet.css";
import CourtDetails from "./components/CourtDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/" element={<Home />} />
        <Route path="/court-details/:id" element={<CourtDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
