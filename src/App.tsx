import { useState } from "react";
import LoginPage from "./pages/login-page";
import UserPage from "./pages/user-page";
import MechanicPage from "./pages/mechanic-page";

type UserRole = "user" | "mechanic" | null;

function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>(null);

  const handleLogin = (role: "user" | "mechanic") => {
    setCurrentRole(role);
  };

  const handleLogout = () => {
    setCurrentRole(null);
  };

  if (currentRole === null) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (currentRole === "user") {
    return <UserPage onLogout={handleLogout} />;
  }

  return <MechanicPage onLogout={handleLogout} />;
}

export default App;

