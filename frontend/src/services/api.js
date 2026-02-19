import axios from 'axios';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Create axios instance with auth header
const createAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

// Product APIs
export const productAPI = {
  getAll: () => 
    axios.get(`${process.env.REACT_APP_API_URL}/api/products`),
  
  getById: (id) => 
    axios.get(`${process.env.REACT_APP_API_URL}/api/products/${id}`),
  
  search: (query) => 
    axios.get(`${process.env.REACT_APP_API_URL}/api/products/search?q=${query}`)
};

// User APIs
export const userAPI = {
  register: (data) => 
    axios.post(`${process.env.REACT_APP_USER_API_URL}/api/auth/register`, data),
  
  login: (data) => 
    axios.post(`${process.env.REACT_APP_USER_API_URL}/api/auth/login`, data),
  
  getProfile: () => 
    axios.get(`${process.env.REACT_APP_USER_API_URL}/api/users/profile`, createAuthHeaders())
};

// Order APIs
export const orderAPI = {
  create: (data) => 
    axios.post(`${process.env.REACT_APP_ORDER_API_URL}/api/orders`, data, createAuthHeaders()),
  
  getAll: () => 
    axios.get(`${process.env.REACT_APP_ORDER_API_URL}/api/orders`, createAuthHeaders()),
  
  getById: (id) => 
    axios.get(`${process.env.REACT_APP_ORDER_API_URL}/api/orders/${id}`, createAuthHeaders())
};

// Payment APIs
export const paymentAPI = {
  process: (data) => 
    axios.post(`${process.env.REACT_APP_PAYMENT_API_URL}/api/payments/process`, data, createAuthHeaders()),
  
  getHistory: () => 
    axios.get(`${process.env.REACT_APP_PAYMENT_API_URL}/api/payments/history`, createAuthHeaders())
};

// Inventory APIs
export const inventoryAPI = {
  getStock: (productId) => 
    axios.get(`${process.env.REACT_APP_INVENTORY_API_URL}/api/inventory/${productId}`),
  
  reserve: (data) => 
    axios.post(`${process.env.REACT_APP_INVENTORY_API_URL}/api/inventory/reserve`, data, createAuthHeaders())
};