import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { authService } from "./service/auth.service";
import { Loader2 } from "lucide-react";

// Lazy load all pages for better performance
const LoginPage = lazy(() => import("./pages/login-page"));
const RegisterPage = lazy(() => import("./pages/register-page"));
const UserPage = lazy(() => import("./pages/user-page"));
const MechanicPage = lazy(() => import("./pages/mechanic-page"));

type AuthView = "login" | "register";
type UserRole = "user" | "mechanic" | null;

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
    </div>
  );
}

function App() {
  const [currentView, setCurrentView] = useState<AuthView>("login");
  const [currentRole, setCurrentRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app initialization
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          // Restore the user's role from the session
          const role = user.role === "mechanic" ? "mechanic" : "user";
          setCurrentRole(role);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (role: "user" | "mechanic") => {
    setCurrentRole(role);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setCurrentRole(null);
      setCurrentView("login");
    }
  };

  const handleRegister = (role: "user" | "mechanic") => {
    setCurrentRole(role);
  };

  // Show loading while checking for existing session
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const renderContent = () => {
    // Show dashboard if logged in
    if (currentRole !== null) {
      if (currentRole === "user") {
        return <UserPage onLogout={handleLogout} />;
      }
      return <MechanicPage onLogout={handleLogout} />;
    }

    // Show auth pages
    if (currentView === "register") {
      return (
        <RegisterPage
          onRegister={handleRegister}
          onLoginClick={() => setCurrentView("login")}
        />
      );
    }

    return (
      <LoginPage
        onLogin={handleLogin}
        onRegisterClick={() => setCurrentView("register")}
      />
    );
  };

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        {renderContent()}
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

