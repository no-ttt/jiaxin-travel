import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inquiriesApi } from "../endpoints/inquiries";
import type { InquiryListFilters, InquiryPatch } from "../types/inquiry";

const inquiriesKey = (filters: InquiryListFilters = {}) => ["inquiries", filters] as const;

export function useInquiryList(filters: InquiryListFilters = {}) {
  return useQuery({
    queryKey: inquiriesKey(filters),
    queryFn: () => inquiriesApi.list(filters),
  });
}

export function useInquiryStats() {
  return useQuery({
    queryKey: ["inquiries", "stats"],
    queryFn: () => inquiriesApi.stats(),
  });
}

export function useInquiry(inquiryId: string) {
  return useQuery({
    queryKey: ["inquiries", inquiryId],
    queryFn: () => inquiriesApi.get(inquiryId),
    enabled: Boolean(inquiryId),
  });
}

export function usePatchInquiry(inquiryId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: InquiryPatch) => inquiriesApi.patch(inquiryId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
    },
  });
}
