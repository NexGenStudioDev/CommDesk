import { DashboardData } from "@/features/Dashboard/Member/v1/Type/dashboard";
import { dashboardData } from "@/features/Member/v1/mock/dashboardData";
import { useQuery } from "@tanstack/react-query";

export const useDashboardData = () => {
  return useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 500));
      return dashboardData;
    },
  });
};
