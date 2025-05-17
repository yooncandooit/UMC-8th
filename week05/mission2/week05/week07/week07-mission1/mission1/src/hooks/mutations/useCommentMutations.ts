import { useMutation } from "@tanstack/react-query";
import { editComment, deleteComment } from "../../apis/lp";

export function useCommentMutations(refetchComments: () => void) {
  const edit = useMutation({
    mutationFn: ({ lpId, commentId, content }: { lpId: number; commentId: number; content: string }) => editComment(lpId, commentId, content),
    onSuccess: () => {
      refetchComments();
    }
  });

  const remove = useMutation({
    mutationFn: ({ lpId, commentId }: { lpId: number; commentId: number }) => deleteComment(lpId, commentId),
    onSuccess: () => {
      refetchComments();
    }
  });

  return { edit, remove };
} 