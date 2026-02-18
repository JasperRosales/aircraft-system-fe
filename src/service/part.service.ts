
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

export interface PlanePart {
  id: number;
  plane_id: number;
  part_name: string;
  serial_number: string;
  category: string;
  usage_hours: number;
  usage_limit_hours: number;
  usage_percent: number;
  installed_at: string;
}

export interface CreatePlanePartRequest {
  part_name: string;
  serial_number: string;
  category: string;
  usage_hours?: number;
  usage_limit_hours: number;
}

export interface UpdatePlanePartRequest {
  part_name?: string;
  serial_number?: string;
  category?: string;
  usage_limit_hours?: number;
  usage_hours?: number;
}

export interface UpdatePartUsageRequest {
  usage_hours: number;
}

class PartService {
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

  async addPart(planeId: number, part: CreatePlanePartRequest): Promise<PlanePart> {
    const response = await fetch(`${API_BASE}/planes/${planeId}/parts`, {
      method: "POST",
      headers: this.getHeaders(),
      credentials: "include",
      body: JSON.stringify(part),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to add part");
    }

    return response.json();
  }

  async getPartsByPlane(planeId: number): Promise<PlanePart[]> {
    const response = await fetch(`${API_BASE}/planes/${planeId}/parts`, {
      method: "GET",
      headers: this.getHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to get parts");
    }

    return response.json();
  }

  async getAllParts(): Promise<PlanePart[]> {
    const response = await fetch(`${API_BASE}/planes/parts`, {
      method: "GET",
      headers: this.getHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to get all parts");
    }

    return response.json();
  }

  async getPart(partId: number): Promise<PlanePart> {
    const response = await fetch(`${API_BASE}/planes/parts/${partId}`, {
      method: "GET",
      headers: this.getHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get part");
    }

    return response.json();
  }

  async updatePart(partId: number, part: UpdatePlanePartRequest): Promise<PlanePart> {
    const response = await fetch(`${API_BASE}/planes/parts/${partId}`, {
      method: "PUT",
      headers: this.getHeaders(),
      credentials: "include",
      body: JSON.stringify(part),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update part");
    }

    return response.json();
  }

  async updatePartUsage(partId: number, usageHours: number): Promise<PlanePart> {
    const response = await fetch(`${API_BASE}/planes/parts/${partId}/usage`, {
      method: "PUT",
      headers: this.getHeaders(),
      credentials: "include",
      body: JSON.stringify({ usage_hours: usageHours }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update part usage");
    }

    return response.json();
  }

  async deletePart(partId: number): Promise<void> {
    const response = await fetch(`${API_BASE}/planes/parts/${partId}`, {
      method: "DELETE",
      headers: this.getHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete part");
    }
  }

  async getMaintenanceAlerts(threshold: number = 80): Promise<PlanePart[]> {
    const response = await fetch(`${API_BASE}/planes/maintenance/alerts?threshold=${threshold}`, {
      method: "GET",
      headers: this.getHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to get maintenance alerts");
    }

    return response.json();
  }

  async getWarningParts(threshold: number = 50): Promise<PlanePart[]> {
    const response = await fetch(`${API_BASE}/planes/maintenance/alerts?threshold=${threshold}`, {
      method: "GET",
      headers: this.getHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to get warning parts");
    }

    return response.json();
  }
}

export const partService = new PartService();

