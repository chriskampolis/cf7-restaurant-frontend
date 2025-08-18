import api from "./api.ts";

const Auth = {
  login: async (username: string, password: string) => {
    return api.post("/api/token/", { username, password });
  },
  refresh: async (refresh: string) => {
    return api.post("/api/token/refresh/", { refresh });
  },
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },
};

export default Auth;