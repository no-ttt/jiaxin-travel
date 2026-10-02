import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tripsApi } from "../endpoints/trips";
import type {
  BatchAction,
  PublicTripSearchParams,
  TripCreate,
  TripListFilters,
  TripUpdate,
} from "../types/trip";

const tripsKey = (filters: TripListFilters = {}) => ["trips", filters] as const;
const tripKey = (tripId: string) => ["trips", tripId] as const;

export function useTripList(filters: TripListFilters = {}) {
  return useQuery({
    queryKey: tripsKey(filters),
    queryFn: () => tripsApi.list(filters),
  });
}

export function useTrip(tripId: string) {
  return useQuery({
    queryKey: tripKey(tripId),
    queryFn: () => tripsApi.get(tripId),
    enabled: Boolean(tripId),
    // Keep showing the previous trip while switching ids (e.g. after a type-change rebuild).
    placeholderData: keepPreviousData,
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TripCreate) => tripsApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trips"] }),
  });
}

export function useUpdateTrip(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TripUpdate) => tripsApi.update(tripId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({ queryKey: tripKey(tripId) });
    },
  });
}

export function useDeleteTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tripId: string) => tripsApi.remove(tripId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trips"] }),
  });
}

export function useDuplicateTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tripId: string) => tripsApi.duplicate(tripId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trips"] }),
  });
}

export function useBatchTrips() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BatchAction) => tripsApi.batch(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trips"] }),
  });
}

export function usePublicTripSearch(params: PublicTripSearchParams, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ["public", "trips", "search", params],
    queryFn: () => tripsApi.publicSearch(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
}

export function usePublicTrip(tripCode: string | null | undefined) {
  return useQuery({
    queryKey: ["public", "trips", tripCode],
    queryFn: () => tripsApi.publicDetail(tripCode!),
    enabled: Boolean(tripCode),
    retry: false,
  });
}
