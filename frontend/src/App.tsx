import "./App.css";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import {
  AuthenticateWithRedirectCallback,
} from "@clerk/clerk-react";

import LandingPage from "./pages/LandingPage/LandingPage";
import SigninPage from "./pages/SigninPage/SigninPage";
import PageNotFound from "./pages/PageNotFound/PageNotFound";

import { DashboardLayout } from "./components/Layout/DashboardLayout";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import EditorPage from "./pages/EditorPage/EditorPage";
import ResumeHistoryPage from "./pages/ResumeHistoryPage/ResumeHistoryPage";
import CoverLetterPage from "./pages/CoverLetterPage/CoverLetterPage";
import JobTrackerPage from "./pages/JobTrackerPage/JobTrackerPage";
import MockInterviewPage from "./pages/MockInterviewPage/MockInterviewPage";
import SkillRoadmapPage from "./pages/SkillRoadmapPage/SkillRoadmapPage";

import { Toaster } from "./components/Sonner/sonner";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/signin"
          element={<SigninPage />}
        />

        {/* Clerk sign-in SSO callback */}
        <Route
          path="/signin/sso-callback"
          element={
            <AuthenticateWithRedirectCallback />
          }
        />

        {/* Global SSO callback */}
        <Route
          path="/sso-callback"
          element={
            <AuthenticateWithRedirectCallback />
          }
        />

        {/* Clerk sign-up SSO callback */}
        <Route
          path="/signin/create/sso-callback"
          element={
            <AuthenticateWithRedirectCallback />
          }
        />

        {/* Dashboard */}
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/editor"
            element={<EditorPage />}
          />
          <Route path="/resume-history" element={<ResumeHistoryPage />} />
          <Route path="/cover-letter" element={<CoverLetterPage />} />
          <Route path="/job-tracker" element={<JobTrackerPage />} />
          <Route path="/mock-interview" element={<MockInterviewPage />} />
          <Route path="/skill-roadmap" element={<SkillRoadmapPage />} />
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={<PageNotFound />}
        />

      </Routes>

      <Toaster />
    </BrowserRouter>
  );
}

export default App;
