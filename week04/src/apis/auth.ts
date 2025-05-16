import { axiosInstance } from "./axios.ts";

import {
  RequestSignInDto,
  ResponseSignInDto,
  ResponseSignUpDto,
  ResponseMyInfoDto,
} from "../types/auth.ts";

export const postSignup = (body: {
  email: string;
  name: string;
  password: string;
}) => {
  return axiosInstance.post<ResponseSignUpDto>("/v1/auth/signup", body); // ✅ baseURL 포함됨
};


export const postSignin = async (
  body: RequestSignInDto
): Promise<ResponseSignInDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signin", body);

  return data;
};

export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  const { data } = await axiosInstance.get("/v1/users/me");

  return data;
};
