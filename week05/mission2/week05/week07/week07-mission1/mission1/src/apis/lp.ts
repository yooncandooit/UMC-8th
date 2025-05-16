import { PaginationDto } from "../types/common";
import { axiosInstance } from "./axios";
import { ResponseLpListDto } from "../types/lp";
import { ResponseLpDetailDto } from "../types/lp";
import { GetCommentsResponse } from "../types/comment";

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
  cursor: number = 0,
  limit: number = 10,
  order: string = "desc"
): Promise<GetCommentsResponse> => {
  console.log("댓글")
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: { cursor, limit, order },
    headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
  });
  console.log("성공");
  return data;
};

export interface CreateLpDto {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  published: boolean;
}

export const createLp = async (data: CreateLpDto) => {
  const response = await axiosInstance.post("/v1/lps", data);
  return response.data;
};

export const deleteLp = async (lpId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);
  return data;
};

export const editLp = async (lpId: number, data: CreateLpDto) => {
  const response = await axiosInstance.patch(`/v1/lps/${lpId}`, data);
  return response.data;
};

export const postComment = async (lpId: number, content: string) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, { content });
  return data;
};

export const deleteComment = async (lpId: number, commentId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
  return data;
};


export const editComment = async (lpId: number, commentId: number, content: string) => {
  const { data } = await axiosInstance.patch(`/v1/lps/${lpId}/comments/${commentId}`, { content });
  return data;
};

export const postLpLike = async (lpId: number) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
  return data;
};

export const deleteLpLike = async (lpId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
  return data;
};

