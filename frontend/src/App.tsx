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
