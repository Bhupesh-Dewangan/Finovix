import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("finovix_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Attempt to refresh the token
          const refreshToken = localStorage.getItem("finovix_token");
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/auth/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );

          const newToken = response.data.token;
          localStorage.setItem("finovix_token", newToken);
          
          // Update user data if provided
          if (response.data.data?.user) {
            localStorage.setItem("finovix_user", JSON.stringify(response.data.data.user));
          }

          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          localStorage.removeItem("finovix_token");
          localStorage.removeItem("finovix_user");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else if (status === 403) {
        console.error("Access denied:", data?.message || "You don't have permission to access this resource");
      } else if (status === 404) {
        console.error("Resource not found:", data?.message || "The requested resource was not found");
      } else if (status >= 500) {
        console.error("Server error:", data?.message || "An unexpected server error occurred");
      }
    } else if (error.request) {
      console.error("Network error: Unable to connect to the server");
    } else {
      console.error("Request error:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;