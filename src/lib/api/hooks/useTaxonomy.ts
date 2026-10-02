import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { taxonomyApi } from "../endpoints/taxonomy";
import type { ThemeIn } from "../types/taxonomy";

export function useRegions() {
  return useQuery({ queryKey: ["taxonomy", "regions"], queryFn: taxonomyApi.listRegions });
}

export function useThemes() {
  return useQuery({ queryKey: ["taxonomy", "themes"], queryFn: taxonomyApi.listThemes });
}

export function useTripStatusOptions() {
  return useQuery({
    queryKey: ["taxonomy", "trip-statuses"],
    queryFn: taxonomyApi.listTripStatuses,
  });
}

export function useBadgeOptions() {
  return useQuery({ queryKey: ["taxonomy", "badges"], queryFn: taxonomyApi.listBadges });
}

export function useNavCategories() {
  return useQuery({
    queryKey: ["taxonomy", "nav-categories"],
    queryFn: taxonomyApi.listNavCategories,
  });
}

export function useCreateTheme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ThemeIn) => taxonomyApi.createTheme(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["taxonomy", "themes"] }),
  });
}
