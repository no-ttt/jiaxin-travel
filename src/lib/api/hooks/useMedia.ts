import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mediaApi } from "../endpoints/media";
import { uploadMedia, type UploadPurpose } from "../upload";

export const mediaKey = (mediaId: string) => ["media", mediaId] as const;

export function useMedia(mediaId: string | null | undefined) {
  return useQuery({
    queryKey: mediaKey(mediaId ?? ""),
    queryFn: () => mediaApi.get(mediaId!),
    enabled: Boolean(mediaId),
    staleTime: Infinity,
  });
}

export function useUploadMedia(purpose: UploadPurpose) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadMedia(file, purpose),
    onSuccess: (media) => queryClient.setQueryData(mediaKey(media.id), media),
  });
}
