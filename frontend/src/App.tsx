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

import { Toaster } from "./components/Sonner/sonner";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>

          {/* Landing Page */}
          <Route
            path="/"
            element={<LandingPage />}
          />

          {/* Sign In */}
          <Route
            path="/signin"
            element={<SigninPage />}
          />

          {/* Clerk SSO Callback */}
          <Route
            path="/signin/sso-callback"
            element={
              <AuthenticateWithRedirectCallback />
            }
          />

          {/* Dashboard Layout */}
          <Route element={<DashboardLayout />}>

            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />

            <Route
              path="/editor"
              element={<EditorPage />}
            />

          </Route>

          {/* 404 */}
          <Route
            path="*"
            element={<PageNotFound />}
          />

        </Routes>
      </BrowserRouter>

      <Toaster />
    </div>
  );
}

export default App;
