import { useQuery } from "@tanstack/react-query";
import { getCommentsByLpId } from "../../apis/lp";
import { ResponseCommentDto } from "../../types/common";

interface UseGetCommentsByLpIdParams {
  lpId: number;
  order?: 'asc' | 'desc';
  cursor?: number;
  limit?: number;
}

export default function useGetCommentsByLpId({ lpId, order = 'desc', cursor = 0, limit = 10 }: UseGetCommentsByLpIdParams) {
  return useQuery<ResponseCommentDto>({
    queryKey: ["comments", lpId, order, cursor, limit],
    queryFn: () => getCommentsByLpId(lpId, cursor, limit, order ),
    enabled: !!lpId,
  });
} 