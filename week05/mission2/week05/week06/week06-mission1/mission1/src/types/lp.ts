import { CursorBasedResponse } from "./common";

export type Tag = {
    id: number;
    name: string;
};

export type Likes = {
    id: number;
    userId: number;
    lpId: number;
}
export type ResponseLpListDto = CursorBasedResponse<{
    data: {
        id: number;
        title: string;
        content: string;
        thumbnail: string;
        published: boolean;
        authorld: number;
        ceatedAt: Date;
        updatedAt: Date;
        tags: Tag[];
        likes: Likes[];
    }[];
}>

export type ResponseLpDetailDto = {
    status: boolean;
    statusCode: number;
    message: string;
    data: {
        id: number;
        title: string;
        content: string;
        thumbnail: string;
        published: boolean;
        authorld: number;
        ceatedAt: Date;
        updatedAt: Date;
        tags: Tag[];
        likes: Likes[];
    };
};

