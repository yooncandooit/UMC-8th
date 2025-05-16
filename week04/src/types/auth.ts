import { CommonResponse } from "./common";

export type RequestSignUpDto = {
  name: string;
  email: string;
  "bio?": string;
  "avatar?": string;
  password: string;
};

export type ResponseSignUpDto = CommonResponse<{
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}>;

export type RequestSignInDto = {
  email: string;
  password: string;
};

export type ResponseSignInDto = CommonResponse<{
  id: number;
  name: string;
  accessToken: string;
  refreshToken: string;
}>;

export type ResponseMyInfoDto = CommonResponse<{
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}>;
