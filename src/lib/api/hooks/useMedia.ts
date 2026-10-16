import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mediaApi } from "../endpoints/media";
import { uploadMedia, type UploadPurpose } from "../upload";

export const mediaKey = (mediaId: string) => ["media", mediaId] as const;

// The backend grabs a video's poster a few seconds after upload; poll until it lands (~1 min max).
const THUMB_POLL_MS = 3000;
const THUMB_POLL_MAX = 20;

export function useMedia(mediaId: string | null | undefined) {
  return useQuery({
    queryKey: mediaKey(mediaId ?? ""),
    queryFn: () => mediaApi.get(mediaId!),
    enabled: Boolean(mediaId),
    staleTime: Infinity,
    refetchInterval: (query) => {
      const media = query.state.data;
      const awaitingThumb = media?.kind === "video" && !media.variants.thumb;
      return awaitingThumb && query.state.dataUpdateCount <= THUMB_POLL_MAX ? THUMB_POLL_MS : false;
    },
  });
}

export function useUploadMedia(purpose: UploadPurpose) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadMedia(file, purpose),
    onSuccess: (media) => queryClient.setQueryData(mediaKey(media.id), media),
  });
}
