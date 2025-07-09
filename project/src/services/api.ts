import { response } from "express";

const API_BASE_URL = 'http://localhost:8000/api/v1';

let forceLogoutFn: () => void = () => {};
export const setForceLogout = (fn: () => void) => {
  forceLogoutFn = fn;
};
class APIService {
  async checkAdminExists() {
    const response = await fetch(`${API_BASE_URL}/user/check-admin`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return this.handleResponse(response);
  }
  
async checkUserExists(email: string) {
  const response = await fetch(`${API_BASE_URL}/user/check-user?email=${encodeURIComponent(email)}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return this.handleResponse(response); // will return { exists: true/false }
}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async handleResponse(response: Response) {
  if (response.status === 403) {
    forceLogoutFn(); // will use global router now
    return;
  }

  let data;
  try {
    data = await response.json();
  } catch (e) {
    throw new Error('Invalid response format.');
  }

  if (!response.ok) {
    throw new Error(data?.message || 'Unexpected error');
  }

  return data;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async generateOtp(email: string) {
    const response=await fetch(`${API_BASE_URL}/user/generate-otp`,{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    return this.handleResponse(response)
  }

  async verifyOtp(email: string, code: string) {
    const response = await fetch(`${API_BASE_URL}/user/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    return this.handleResponse(response);
  }
  
  async signup(userData: {    
    name: string;
    email: string;
    phone: string;
    password: string;
    role?: 'USER' | 'PROVIDER' | 'ADMIN';
  }) {
    const response = await fetch(`${API_BASE_URL}/user/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async signin(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/user/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse(response);
  }

  async getCurrentUser() {
    return this.request('/user/me');
  }

  async updateProfile(data: { name?: string; password?: string }) {
    const response = await fetch(`${API_BASE_URL}/user/update-profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }
}

export const apiService = new APIService()
