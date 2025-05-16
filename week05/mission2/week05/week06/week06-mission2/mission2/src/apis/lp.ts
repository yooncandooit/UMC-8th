import { PaginationDto } from "../types/common";
import { axiosInstance } from "./axios";
import { ResponseLpListDto } from "../types/lp";
import { ResponseLpDetailDto } from "../types/lp";
import { ResponseCommentDto } from "../types/common";

export const getLpList = async (paginationDto: PaginationDto): Promise<ResponseLpListDto> => {
    const { data } = await axiosInstance.get("/v1/lps", {
        params: paginationDto,
    });
    return data;
};

export const getLpDetail = async (lpId: number): Promise<ResponseLpDetailDto> => {
    const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
    return data;
};

export const getCommentsByLpId = async (
  lpId: number,
  order: 'asc' | 'desc' = 'desc',
  cursor: number = 0,
  limit: number = 10
): Promise<ResponseCommentDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: { order, cursor, limit },
  });
  return data;
};

