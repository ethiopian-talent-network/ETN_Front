import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Landing from "./pages/landing";
import OtpVerification from "./pages/otp-verification";
import EmployerDashboard from "./pages/employer-dashboard";
import TalentDashboard from "./pages/talent-dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<OtpVerification />} />
        <Route path="/employer-dashboard" element={<EmployerDashboard />} />
        <Route path="/talent-dashboard" element={<TalentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
