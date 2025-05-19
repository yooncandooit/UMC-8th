import { useQuery } from "@tanstack/react-query";
import { PaginationDto } from "../../types/common";
import { getLpList } from "../../apis/lp";



function useGetLpList({ cursor, search, order, limit }: PaginationDto) {
    return useQuery({
        queryKey: ["lps", { cursor, search, order, limit }],
        queryFn: () => getLpList({ cursor, search, order, limit }),
        staleTime: 1000 * 60 * 5, 
        gcTime: 1000 * 60 * 10,

        select: (data) => data.data.data,
    });
}  

export default useGetLpList;
