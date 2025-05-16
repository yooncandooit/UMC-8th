import { useMutation } from "@tanstack/react-query";
import { postLpLike, deleteLpLike } from "../../apis/lp";

export function useLpLikeMutation(refetchLpDetail: () => void) {
  const like = useMutation({
    mutationFn: (lpId: number) => postLpLike(lpId),
    onSuccess: () => {
      refetchLpDetail();
    }
  });

  const unlike = useMutation({
    mutationFn: (lpId: number) => deleteLpLike(lpId),
    onSuccess: () => {
      refetchLpDetail();
    }
  });

  return { like, unlike };
} 