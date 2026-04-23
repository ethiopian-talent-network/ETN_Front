import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Landing from "./pages/landing";
import OtpVerification from "./pages/otp-verification";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import FreelancerDashboard from "./features/dashboard/FreelancerDashboard";
import MessagingPage from "./features/messaging/MessagingPage";
import JobPosting from "./pages/JobPosting";
import FreelancerPublicProfile from "./pages/talentPublicProfile";
import TalentProfile from "./pages/talentProfile";
import MyApplications from "./components/talent/MyApplications";
import Billing from "./components/talent/Billing";
import JobApplications from "./pages/JobApplications";
import ApplyToJob from "./pages/ApplyToJob";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/routes/ProtectedRoute";
import { ErrorBoundary } from "./components/error/ErrorBoundary";
import { NotFound } from "./components/error/NotFound";
import { Unauthorized } from "./components/error/Unauthorized";
import {
  PUBLIC_ROUTES,
  TALENT_ROUTES,
  EMPLOYER_ROUTES,
  SHARED_ROUTES,
} from "./config/routes";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DarkModeProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path={PUBLIC_ROUTES.HOME.path} element={<Landing />} />
              <Route path={PUBLIC_ROUTES.LOGIN.path} element={<Login />} />
              <Route path={PUBLIC_ROUTES.SIGNUP.path} element={<Signup />} />
              <Route
                path={PUBLIC_ROUTES.OTP_VERIFICATION.path}
                element={<OtpVerification />}
              />
              <Route
                path={PUBLIC_ROUTES.PUBLIC_PROFILE.path}
                element={<FreelancerPublicProfile />}
              />

              {/* Protected routes - Talent only */}
              <Route
                path={TALENT_ROUTES.DASHBOARD.path}
                element={
                  <ProtectedRoute allowedRoles={["talent"]}>
                    <FreelancerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path={TALENT_ROUTES.PROFILE.path}
                element={
                  <ProtectedRoute allowedRoles={["talent"]}>
                    <TalentProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path={TALENT_ROUTES.PROFILE_EDIT.path}
                element={
                  <ProtectedRoute allowedRoles={["talent"]}>
                    <TalentProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path={TALENT_ROUTES.APPLICATIONS.path}
                element={
                  <ProtectedRoute allowedRoles={["talent"]}>
                    <MyApplications />
                  </ProtectedRoute>
                }
              />
              <Route
                path={TALENT_ROUTES.APPLY_JOB.path}
                element={<ApplyToJob />}
              />
              <Route
                path={TALENT_ROUTES.BILLING.path}
                element={
                  <ProtectedRoute allowedRoles={["talent"]}>
                    <Billing />
                  </ProtectedRoute>
                }
              />

              {/* Shared routes - Both talent and employer */}
              <Route
                path={SHARED_ROUTES.MESSAGES.path}
                element={
                  <ProtectedRoute allowedRoles={["talent", "employer"]}>
                    <MessagingPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected routes - Employer only */}
              <Route
                path={EMPLOYER_ROUTES.DASHBOARD.path}
                element={
                  <ProtectedRoute allowedRoles={["employer"]}>
                    <EmployerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path={EMPLOYER_ROUTES.POST_JOB.path}
                element={
                  <ProtectedRoute allowedRoles={["employer"]}>
                    <JobPosting />
                  </ProtectedRoute>
                }
              />
              <Route
                path={EMPLOYER_ROUTES.JOB_APPLICATIONS.path}
                element={
                  <ProtectedRoute allowedRoles={["employer"]}>
                    <JobApplications />
                  </ProtectedRoute>
                }
              />

              {/* Error routes */}
              <Route
                path={PUBLIC_ROUTES.UNAUTHORIZED.path}
                element={<Unauthorized />}
              />

              {/* 404 catch-all */}
              <Route
                path={PUBLIC_ROUTES.NOT_FOUND.path}
                element={<NotFound />}
              />
            </Routes>
          </BrowserRouter>
        </DarkModeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
