const API_BASE_URL = 'http://localhost:8000/api/v1';

let forceLogoutFn: () => void = () => {};
export const setForceLogout = (fn: () => void) => {
  forceLogoutFn = fn;
};

class APIService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async handleResponse(response: Response) {
    if (response.status === 403) {
      forceLogoutFn();
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

    return this.handleResponse(response);
  }

  // Auth APIs
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
    return this.handleResponse(response);
  }

  async generateOtp(email: string) {
    const response = await fetch(`${API_BASE_URL}/user/generate-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return this.handleResponse(response);
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
    role: string;
    password: string;
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
    return this.request('/user/update-profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Provider APIs
  async getProviderProfile() {
    return this.request('/provider-profile');
  }

  async createOrUpdateProviderProfile(data: any) {
    return this.request('/provider-profile', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAllProviders() {
    return this.request('/provider-profile/all');
  }

  // Booking APIs
  async createBooking(data: {
    providerId: string;
    category: string;
    dateTime: string;
    location: string;
    notes?: string;
    price: number;
  }) {
    return this.request('/booking', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyBookings() {
    return this.request('/booking/my-bookings');
  }

  async getMyJobs() {
    return this.request('/booking/my-jobs');
  }

  async updateBookingStatus(bookingId: string, status: string) {
    return this.request(`/booking/${bookingId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Wallet APIs
  async getWallet() {
    return this.request('/wallet');
  }

  async getWalletTransactions() {
    return this.request('/wallet/transactions');
  }

  async topupWallet(amount: number) {
    return this.request('/wallet/topup', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  // Review APIs
  async createReview(data: {
    providerId: string;
    rating: number;
    comment: string;
  }) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProviderReviews(providerId: string) {
    return this.request(`/reviews/provider/${providerId}`);
  }

  async getProviderAverageRating(providerId: string) {
    return this.request(`/reviews/provider/${providerId}/average`);
  }

  // Message APIs
  async getMessages(receiverId: string) {
    return this.request(`/messages/${receiverId}`);
  }

  async sendMessage(receiverId: string, content: string) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify({ receiverId, content }),
    });
  }

  // Notification APIs
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationAsRead(notificationId: string) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  // Category APIs
  async getCategories() {
    return this.request('/categories');
  }

  async createCategory(data: { name: string; image?: string }) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Coupon APIs
  async getCoupons() {
    return this.request('/coupons');
  }

  async createCoupon(data: {
    code: string;
    discount: number;
    maxAmount: number;
    expiryDate: string;
  }) {
    return this.request('/coupons', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Match APIs
  async findNearbyProviders(data: {
    latitude: number;
    longitude: number;
    radiusKm?: number;
  }) {
    return this.request('/match/nearby', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // File APIs
  async uploadFile(file: File, type: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    });

    return this.handleResponse(response);
  }

  async getUserFiles(userId: string) {
    return this.request(`/files/user/${userId}`);
  }

  // Admin APIs
  async getAllUsers() {
    return this.request('/user/users');
  }

  async deleteUser(userId: string) {
    return this.request('/user/user', {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    });
  }
}

export const apiService = new APIService();