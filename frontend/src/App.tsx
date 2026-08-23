import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SigninPage />} />

          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/editor" element={<EditorPage />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
