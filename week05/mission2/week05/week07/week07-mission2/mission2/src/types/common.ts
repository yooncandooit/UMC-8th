import { PAGINATION_ORDER } from './../../enums/common';

export type CommonResponse<T> = {
    status: boolean;
    statusCode: number;
    message: string;
    data: T;
}

export type CursorBasedResponse<T> = CommonResponse<{
    data: T;
    newCursor: number | null;
    hasNext: boolean;
}>;


    export type PaginationDto = {
    cursor?: number;
    limit?: number;
    search?: string;
    order?: PAGINATION_ORDER;
};


export type Comment = {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

// 댓글 응답 DTO 타입 추가
export type ResponseCommentDto = {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    data: Comment[];
    nextCursor: number | null;
    hasNext: boolean;
  };
};