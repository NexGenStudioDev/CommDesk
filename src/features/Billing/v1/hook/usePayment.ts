import api from "@/utils/axios.utils";
import { useMutation } from "@tanstack/react-query";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export const useCreatePaymentIntent = () => {
  return useMutation({
    mutationKey: ["createPaymentIntent"],

    mutationFn: async (paymentData: {
      customerEmail: string;
      customerName: string;
      customerPhone: string;
      order_amount: number;
    }) => {
      const response = await api.post(`${baseUrl}/payment/create-payment-intent`, paymentData);
      return response.data;
    },

    onSuccess: (response) => {
      console.log("Payment intent created successfully:", response.data);
    },

    onError: (error) => {
      console.error("Failed to create payment intent:", error);
    },
  });
};
