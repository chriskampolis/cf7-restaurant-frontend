import api from "./api.ts";

const Auth = {
  login: async (username: string, password: string) => {
    return api.post("/api/token/", { username, password });
  },

  logout: () => {
    localStorage.removeItem("access_token");
  },
};

export default Auth;