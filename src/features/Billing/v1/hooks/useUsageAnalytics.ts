import { useQuery } from "@tanstack/react-query";
import { walletStore } from "../mock/walletStore";

export function useUsageSummary() {
  return useQuery({
    queryKey: ["usage", "summary"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return walletStore.getUsageSummary();
    },
    staleTime: 60_000,
  });
}

export function useUsageBreakdown() {
  return useQuery({
    queryKey: ["usage", "breakdown"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return walletStore.getUsageBreakdown();
    },
    staleTime: 60_000,
  });
}

export function useUsageForecast() {
  return useQuery({
    queryKey: ["usage", "forecast"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return walletStore.getUsageForecast();
    },
    staleTime: 120_000,
  });
}

export function useTeamUsage() {
  return useQuery({
    queryKey: ["usage", "team"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return walletStore.getTeamUsage();
    },
  });
}
