import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/registration/Register";
import Home from "./components/map/Home";
import Verify from "./components/registration/Verify";
import "leaflet/dist/leaflet.css";
import CourtDetails from "./components/court_details/CourtDetails";
import ProfileDetails from "./components/profile_details/ProfileDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/" element={<Home />} />
        <Route path="/court-details/:id" element={<CourtDetails />} />
        <Route path="/profile-details/:id" element={<ProfileDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
