import axios from "axios";
import { Route, Routes, useNavigate,useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./auth/Home";
import VerifyEmailPage from './auth/VerifyEmailPage';
import ForgotPasswordPage from './auth/ForgotPasswordPage';
import ResetPasswordPage from './auth/ResetPasswordPage';
import IndexPage from "./pages/index";
import Myvault from "./pages/myvault";
import PricingPage from "@/pages/pricing";
import EncryptSave from "@/pages/EncryptSave";
import AboutPage from "@/pages/about";
import { Navbar } from "./components/navbar";
import LoginPage from "./auth/LoginPage";
import SignupPage from "./auth/SignupPage";
import PageNotFound from './config/PageNotFound.jsx';
import Settings from "./pages/settings";
import ProtectedRoute from "./components/Layout/ProtectedRoute.tsx";
import PublicOnlyRoute from "./components/Layout/PublicOnlyRoute";
import { GlobalPasswordProvider } from "./GlobalPasswordProvider";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();



  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ;

    if (!token) {
      console.warn("No token found in localStorage.");
      setUser && setUser(null);
      return false;
    }

    try {
      console.log("Checking auth with token:", token);

      const response = await axios.get(`${BACKEND_URL}/check-auth`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data?.authenticated) {
        console.log("User authenticated:", response.data.user);
        setUser && setUser(response.data.user);
        return true;
      } else {
        console.warn("Auth check failed: Not authenticated.");
        localStorage.removeItem("token");
        setUser && setUser(null);
        return false;
      }
    } catch (err) {
      console.error("Auth check error:", err?.response?.data || err.message);
      localStorage.removeItem("token");
      setUser && setUser(null);
      return false;
    }
  };

  useEffect(() => {
    const init = async () => {
      const isAuth = await checkAuth();
      if (isAuth && location.pathname === '/') {
        navigate('/dashboard');
      }
      setIsLoading(false);
    };
    init();
    // eslint-disable-next-line
  }, [navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
     <GlobalPasswordProvider>
    <>
      <Navbar user={user} setUser={setUser} />
      <Routes>
          {/* Public routes */}
        <Route path="/" element={<Home user={user} />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage refreshUser={checkAuth} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage refreshUser={checkAuth} />} />

      <Route path="/login" element={
          <PublicOnlyRoute user={user}>
            <LoginPage setUser={setUser} />
          </PublicOnlyRoute>
        } />
        <Route path="/signup" element={
          <PublicOnlyRoute user={user}>
            <SignupPage />
          </PublicOnlyRoute>
        } />

        {/* Protected route */}
        <Route path="/dashboard" element={
          <ProtectedRoute user={user}>
            <IndexPage user={user} />
          </ProtectedRoute>
        } />
        <Route
          path="/myvault"
          element={
            <ProtectedRoute user={user}>
              <Myvault />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Encrypt"
          element={
            <ProtectedRoute user={user}>
              <EncryptSave />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upgrade"
          element={
            <ProtectedRoute user={user}>
              <PricingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute user={user}>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute user={user}>
              <AboutPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
    </GlobalPasswordProvider>
  );
}

export default App;
