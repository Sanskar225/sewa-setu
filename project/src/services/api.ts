const API_BASE_URL = 'http://localhost:8000/api/v1';

class APIService {
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // ----------------------
  // 🔐 AUTH
  // ----------------------
  async login(email: string, password: string) {
    return this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role?: 'USER' | 'PROVIDER' | 'ADMIN';
  }) {
    return this.request('/user/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateOtp(email: string) {
    return this.request('/user/generate-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyOtp(email: string, code: string) {
    return this.request('/user/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  }

  async getCurrentUser() {
    return this.request('/user/me');
  }

  async updateProfile(data: { name?: string; phone?: string }) {
    return this.request('/user/update-profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ----------------------
  // 👨‍🔧 PROVIDERS
  // ----------------------
  async getProviders() {
    return this.request('/provider-profile/all');
  }

  async createProviderProfile(data: any) {
    return this.request('/provider-profile', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getNearbyProviders(latitude: number, longitude: number, radiusKm: number = 10) {
    return this.request('/match/nearby', {
      method: 'POST',
      body: JSON.stringify({ latitude, longitude, radiusKm }),
    });
  }

  // ----------------------
  // 📅 BOOKINGS
  // ----------------------
  async createBooking(data: any) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyBookings() {
    return this.request('/bookings/my-bookings');
  }

  async updateBookingStatus(bookingId: string, status: string) {
    return this.request(`/bookings/${bookingId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // ----------------------
  // 📂 SERVICE CATEGORIES
  // ----------------------
  async getServiceCategories() {
    return this.request('/service-categories');
  }

  // ----------------------
  // 💰 WALLET
  // ----------------------
  async getWallet() {
    return this.request('/wallet');
  }

  async topupWallet(amount: number) {
    return this.request('/wallet/topup', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  // ----------------------
  // 🌟 REVIEWS
  // ----------------------
  async getProviderReviews(providerId: string) {
    return this.request(`/reviews/provider/${providerId}`);
  }

  async createReview(providerId: string, rating: number, comment: string) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify({ providerId, rating, comment }),
    });
  }

  // ----------------------
  // 💬 MESSAGES
  // ----------------------
  async getMessages(receiverId: string) {
    return this.request(`/messages/${receiverId}`);
  }

  async sendMessage(receiverId: string, content: string) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify({ receiverId, content }),
    });
  }
}

export const apiService = new APIService();
