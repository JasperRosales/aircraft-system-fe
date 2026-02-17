const getApiBase = (): string => {
  const envUrl = import.meta.env.VITE_SERVER_API;
  
  if (!envUrl) {
    return "http://localhost:8080/api";
  }
  
  let url = envUrl;
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "http://" + url;
  }
  
  if (!url.endsWith("/api")) {
    url = url + "/api";
  }
  
  return url;
};

const API_BASE = getApiBase();

export interface Plane {
  id: number;
  tail_number: string;
  model: string;
  created_at: string;
}

export interface CreatePlaneRequest {
  tail_number: string;
  model: string;
}

export interface UpdatePlaneRequest {
  tail_number?: string;
  model?: string;
}

export interface PlaneWithParts {
  plane: Plane;
  parts: any[];
}

class PlaneService {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    return headers;
  }

  private getToken(): string | null {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "auth_token") {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  async createPlane(plane: CreatePlaneRequest): Promise<Plane> {
    const response = await fetch(`${API_BASE}/planes`, {
      method: "POST",
      headers: this.getHeaders(),
      credentials: "include",
      body: JSON.stringify(plane),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create plane");
    }

    return response.json();
  }

  async getAllPlanes(): Promise<Plane[]> {
    const response = await fetch(`${API_BASE}/planes`, {
      method: "GET",
      headers: this.getHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to get planes");
    }

    return response.json();
  }

  async getPlane(id: number): Promise<Plane> {
    const response = await fetch(`${API_BASE}/planes/${id}`, {
      method: "GET",
      headers: this.getHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get plane");
    }

    return response.json();
  }

  async getPlaneByTailNumber(tailNumber: string): Promise<Plane> {
    const response = await fetch(`${API_BASE}/planes/tail/${tailNumber}`, {
      method: "GET",
      headers: this.getHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get plane by tail number");
    }

    return response.json();
  }

  async updatePlane(id: number, plane: UpdatePlaneRequest): Promise<Plane> {
    const response = await fetch(`${API_BASE}/planes/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      credentials: "include",
      body: JSON.stringify(plane),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update plane");
    }

    return response.json();
  }

  async deletePlane(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/planes/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete plane");
    }
  }

  async getPlaneWithParts(id: number): Promise<PlaneWithParts> {
    const response = await fetch(`${API_BASE}/planes/${id}/with-parts`, {
      method: "GET",
      headers: this.getHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get plane with parts");
    }

    return response.json();
  }
}

export const planeService = new PlaneService();

