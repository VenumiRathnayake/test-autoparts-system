import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      window.location.href = '/account';
    }
    return Promise.reject(error);
  }
);

// User API calls
export const userAPI = {
  // Login user
  login: (credentials) => api.post('/users/login', credentials),
  
  // Register user
  register: (userData) => api.post('/users', userData),
  
  // Get user by ID
  getUser: (id) => api.get(`/users/${id}`),
  
  // Update user
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  
  // Delete user
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Vendor API calls
export const vendorAPI = {
  // Login vendor
  login: (credentials) => api.post('/vendors/login', credentials),
  
  // Register vendor
  register: (vendorData) => api.post('/vendors', vendorData),
  
  // Get all vendors
  getAll: () => api.get('/vendors'),
  
  // Get vendor by ID
  getVendor: (id) => api.get(`/vendors/${id}`),
  
  // Update vendor
  updateVendor: (id, vendorData) => api.put(`/vendors/${id}`, vendorData),
  
  // Delete vendor
  deleteVendor: (id) => api.delete(`/vendors/${id}`),
  
  // Approve vendor
  approveVendor: (id, approvedBy) => api.put(`/vendors/${id}/approve`, { approvedBy }),
  
  // Decline vendor
  declineVendor: (id, approvedBy) => api.put(`/vendors/${id}/decline`, { approvedBy }),
  
  // Get vendors by status
  getVendorsByStatus: (status) => api.get(`/vendors/status/${status}`),
};

// Category API calls
export const categoryAPI = {
  // Get all categories
  getAll: () => api.get('/categories'),
  
  // Get category by ID
  getById: (id) => api.get(`/categories/${id}`),
  
  // Create category
  create: (categoryData) => api.post('/categories', categoryData),
  
  // Update category
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  
  // Delete category
  delete: (id) => api.delete(`/categories/${id}`),
  
  // Search categories
  search: (query) => api.get(`/categories/search?query=${query}`),
  
  // Get categories by name
  getByName: (name) => api.get(`/categories/name/${name}`),
  
  // Get categories by model
  getByModel: (model) => api.get(`/categories/model/${model}`),
  
  // Get categories by year
  getByYear: (year) => api.get(`/categories/year/${year}`),
  
  // Get categories by fuel type
  getByFuelType: (fuelType) => api.get(`/categories/fuel-type/${fuelType}`),
  
  // Get all fuel types
  getFuelTypes: () => api.get('/categories/fuel-types'),
  
  // Get all years
  getYears: () => api.get('/categories/years'),
};

// Parts API calls
export const partsAPI = {
  // Get all parts
  getAll: () => api.get('/parts'),
  // Get top selling parts
  getTop: () => api.get('/parts/top'),
  
  // Get part by ID
  getById: (id) => api.get(`/parts/${id}`),
  
  // Create part
  create: (partData) => api.post('/parts', partData),
  
  // Update part
  update: (id, partData) => api.put(`/parts/${id}`, partData),
  
  // Delete part
  delete: (id) => api.delete(`/parts/${id}`),
  
  // Search parts
  search: (query) => api.get(`/parts/search?query=${query}`),
  
  // Get parts by category
  getByCategory: (category) => api.get(`/parts/category/${category}`),
  
  // Get parts by vendor
  getByVendor: (vendorId) => api.get(`/parts/vendor/${vendorId}`),
  
  // Mark part as sold
  markAsSold: (id) => api.put(`/parts/${id}/sold`),
  
  // Mark multiple parts as sold
  markMultipleAsSold: (partIds) => api.post('/parts/sold', { partIds }),
};

// Articles API calls
export const articlesAPI = {
  // Get all articles
  getAll: () => api.get('/articles'),
  
  // Get article by ID
  getById: (id) => api.get(`/articles/${id}`),
  
  // Create article
  create: (articleData) => api.post('/articles', articleData),
  
  // Update article
  update: (id, articleData) => api.put(`/articles/${id}`, articleData),
  
  // Delete article
  delete: (id) => api.delete(`/articles/${id}`),
  
  // Search articles
  search: (query) => api.get(`/articles/search?query=${query}`),
  
  // Get recent articles
  getRecent: () => api.get('/articles/recent'),
};

// Category Request API calls
export const categoryRequestAPI = {
  // Create category request
  create: (requestData) => api.post('/category-requests', requestData),
  
  // Get all category requests (admin)
  getAll: (status) => api.get(`/category-requests${status ? `?status=${status}` : ''}`),
  
  // Get category requests by vendor
  getByVendor: (vendorId, status) => api.get(`/category-requests/vendor/${vendorId}${status ? `?status=${status}` : ''}`),
  
  // Get category request by ID
  getById: (id) => api.get(`/category-requests/${id}`),
  
  // Approve category request
  approve: (id, adminResponse, processedBy) => api.put(`/category-requests/${id}/approve`, { adminResponse, processedBy }),
  
  // Decline category request
  decline: (id, adminResponse, processedBy) => api.put(`/category-requests/${id}/decline`, { adminResponse, processedBy }),
  
  // Delete category request
  delete: (id) => api.delete(`/category-requests/${id}`),
};

// Order API calls
export const orderAPI = {
  // Create new order
  create: (orderData) => api.post('/orders', orderData),
  
  // Get orders by user
  getByUser: (userId) => api.get(`/orders/user/${userId}`),
  
  // Get orders by vendor
  getByVendor: (vendorId) => api.get(`/orders/vendor/${vendorId}`),
  
  // Get order by ID
  getById: (id) => api.get(`/orders/${id}`),
  
  // Get all orders (admin)
  getAll: () => api.get('/orders'),
  
  // Update order status
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  
  // Delete order
  delete: (id) => api.delete(`/orders/${id}`),
};

// Auth helper functions
export const authHelper = {
  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },
  
  // Get user role
  getRole: () => {
    return localStorage.getItem('role');
  },
  
  // Get user ID
  getUserId: () => {
    return localStorage.getItem('userId');
  },
  
  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    window.location.href = '/account';
  },
  
  // Set auth data
  setAuthData: (token, role, userId, email) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userEmail', email);
  },
  
  // Get user email
  getUserEmail: () => {
    return localStorage.getItem('userEmail');
  },
};

export default api;
