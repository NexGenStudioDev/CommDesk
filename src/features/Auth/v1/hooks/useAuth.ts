import api from "@/utils/axios.utils";
import { useMutation } from "@tanstack/react-query";

import AUTH_ENDPOINTS from "../Constant/Auth.Endpoint.Constant";
import useAuthStore from "../Store/Auth.Store";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

// =========================
// LOGIN MUTATION HOOK
// =========================

const useLoginMutation = () => {
  return useMutation({
    mutationKey: ["login"],

    mutationFn: async (credentials: { email: string; password: string }) => {
      try {
        const response = await api.post(`${baseUrl}${AUTH_ENDPOINTS.LOGIN}`, credentials);
        return response.data;
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },



    onSuccess: (response) => {
      
      const user = response.data;
      console.log("Login successful:", user);

      if(user.role === "organization"){
          let {mutate} = useGetOrganization_Mutation() 
           mutate(user._id)

      }

      useAuthStore.getState().setAuthData(user);
    },
  });
};


const useGetOrganization_Mutation = () => {
  return useMutation({
    mutationKey: ["organization"],

    mutationFn: async (id: string) => {
      try {
        const response = await api.get(`${baseUrl}${AUTH_ENDPOINTS.GET_ORGANIZATION_BY_ID}?id=${id}`);
        return response.data;
      } catch (error) {
        console.error("Failed to fetch organization data:", error);
        throw error;
      }
    },
  });
}

// =========================
// AUTH HOOK
// =========================

export const useAuth = () => {
  const loginMutation = useLoginMutation();

  return {
    loginMutation,
  };
};
