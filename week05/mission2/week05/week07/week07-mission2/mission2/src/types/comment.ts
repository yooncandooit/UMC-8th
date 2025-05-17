export interface Author {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
}

export interface GetCommentsResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    data: Comment[];
    nextCursor: number;
    hasNext: boolean;
  };
} 