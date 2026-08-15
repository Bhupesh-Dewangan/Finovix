import api from "./api";

export const authService = {
  // Login user
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  // Register new user
  signup: async (name, email, password) => {
    const response = await api.post("/auth/signup", { name, email, password });
    return response.data;
  },

  // Get current user info
  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem("finovix_token");
    localStorage.removeItem("finovix_user");
  },
};

export default authService;