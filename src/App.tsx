import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Landing from "./pages/landing";
import OtpVerification from "./pages/otp-verification";
import EmployerDashboard from "./pages/employerDashboard";
import TalentDashboard from "./pages/talentDashboard";
import Messages from "./pages/Messages";
import JobPosting from "./pages/JobPosting";
import FreelancerPublicProfile from "./pages/talentPublicProfile";
import TalentProfile from "./pages/talentProfile";
import { DarkModeProvider } from "./contexts/DarkModeContext";

function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<OtpVerification />} />
          <Route path="/employer-dashboard" element={<EmployerDashboard />} />
          <Route path="/talent-dashboard" element={<TalentDashboard />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/post-job" element={<JobPosting />} />
          <Route
            path="/freelancer-profile"
            element={<FreelancerPublicProfile />}
          />
          <Route
            path="/freelancer-profile/:id"
            element={<FreelancerPublicProfile />}
          />
          <Route path="/talent-profile" element={<TalentProfile />} />
          <Route path="/talent-profile/:id" element={<TalentProfile />} />
        </Routes>
      </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;
