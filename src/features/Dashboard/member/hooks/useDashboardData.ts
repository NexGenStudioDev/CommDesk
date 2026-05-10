import { useQuery } from "@tanstack/react-query";
import { dashboardData } from "../mock/dashboardData";
import { DashboardData } from "../types/dashboard";

export const useDashboardData = () => {
  return useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 500));
      return dashboardData;
    },
  });
};
