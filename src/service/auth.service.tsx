// Get API base URL from env var, ensuring it has the correct format
const getApiBase = (): string => {
  const envUrl = import.meta.env.VITE_SERVER_API;
  
  if (!envUrl) {
    return "http://localhost:8080/api";
  }
  
  // Add protocol if missing
  let url = envUrl;
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "http://" + url;
  }
  
  // Add /api suffix if missing
  if (!url.endsWith("/api")) {
    url = url + "/api";
  }
  
  return url;
};

const API_BASE = getApiBase();

export interface User {
  id: number;
  name: string;
  role: string;
  created_at: string;
}

export interface LoginRequest {
  name: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  password: string;
}

export interface AuthResponse {
  user: User;
}

class AuthService {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    // Get token from cookie
    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    return headers;
  }

  private getToken(): string | null {
    // Try to get token from cookie
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "auth_token") {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  async login(name: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important for cookies
      body: JSON.stringify({ name, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Login failed";
      try {
        const error = JSON.parse(errorText);
        errorMessage = error.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data: AuthResponse = await response.json();
    return data.user;
  }

  async register(name: string, password: string, _role: string): Promise<User> {
    const response = await fetch(`${API_BASE}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      // Backend expects: { name, password } - role is ignored (always set to "user")
      body: JSON.stringify({ name, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Registration failed";
      try {
        const error = JSON.parse(errorText);
        errorMessage = error.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const user: User = await response.json();
    return user;
  }

  async logout(): Promise<void> {
    await fetch(`${API_BASE}/users/logout`, {
      method: "POST",
      headers: this.getHeaders(),
      credentials: "include",
    });
  }

  async getCurrentUser(): Promise<User | null> {
    const response = await fetch(`${API_BASE}/users`, {
      method: "GET",
      headers: this.getHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const users: User[] = await response.json();
    return users[0] || null;
  }

  async getUserById(id: number): Promise<User> {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: "GET",
      headers: this.getHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to get user");
    }

    return response.json();
  }
}

export const authService = new AuthService();
