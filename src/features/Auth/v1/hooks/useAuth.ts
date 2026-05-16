import api from "@/utils/axios.utils";
import { useMutation } from "@tanstack/react-query";
import AUTH_ENDPOINTS from "../Constant/Auth.Endpoint.Constant";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

// =========================
// LOGIN MUTATION HOOK
// =========================

const useLoginMutation = () => {
  return useMutation({
    mutationKey: ["login"],

    mutationFn: async (credentials: { email: string; password: string }) => {
      try {
        console.log("Attempting login with credentials:", credentials);
        const response = await api.post(`${baseUrl}${AUTH_ENDPOINTS.LOGIN}`, credentials);
        return response.data;
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },
  });
};

// =========================
// AUTH HOOK
// =========================

export const useAuth = () => {
  const loginMutation = useLoginMutation();

  return {
    loginMutation,
  };
};
