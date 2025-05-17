import { useInfiniteQuery } from "@tanstack/react-query";
import { PAGINATION_ORDER } from "../../../enums/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../../src/constants/key";
function useGetInfiniteLpList(limit:number, search:string, order:PAGINATION_ORDER,)
 {
    return useInfiniteQuery({
        queryFn: ({ pageParam }) => getLpList({ cursor: pageParam, search, order, limit }),
        queryKey: [QUERY_KEY,search, order],
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
        },
        initialPageParam: 0,
    })
}

export default useGetInfiniteLpList;
