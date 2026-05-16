import api from "@/utils/axios.utils";
import { useMutation } from "@tanstack/react-query";

import AUTH_ENDPOINTS from "../Constant/Auth.Endpoint.Constant";
import useAuthStore from "../Store/Auth.Store";
import useOrganizationStore from "../Store/Organization.Store";

const baseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

// =========================
// GET ORGANIZATION
// =========================

const useGetOrganizationMutation = () => {
  return useMutation({
    mutationKey: ["organization"],

    mutationFn: async (_id: string) => {
      const response = await api.get(
        `${baseUrl}${AUTH_ENDPOINTS.GET_ORGANIZATION_BY_ID}?ownerId=${_id}`
      );

      return response.data;
    },

    onSuccess: (response) => {
      useOrganizationStore.getState().setOrganization(response.data);
    },

    onError: (error) => {
      console.error("Failed to fetch organization:", error);
    },
  });
};

// =========================
// LOGIN
// =========================

const useLoginMutation = () => {
  const organizationMutation = useGetOrganizationMutation();

  return useMutation({
    mutationKey: ["login"],

    mutationFn: async (credentials: {
      email: string;
      password: string;
    }) => {
      const response = await api.post(
        `${baseUrl}${AUTH_ENDPOINTS.LOGIN}`,
        credentials
      );

      return response.data;
    },

    onSuccess: async (response) => {
      const user = response.data;

      console.log("Login successful:", user);

      // Save auth first
      useAuthStore.getState().setAuthData(user);

      // Fetch organization if needed
      if (user.role === "organization") {
        await organizationMutation.mutateAsync(user._id);
      }
    },

    onError: (error) => {
      console.error("Login failed:", error);
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