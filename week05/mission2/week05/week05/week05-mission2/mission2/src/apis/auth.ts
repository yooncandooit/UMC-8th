import { RequestSigninDto, RequestSignupDto, ResponseMyInfoDto, ResponseSigninDto, ResponseSignupDto } from "../types/auth";
import { axiosInstance } from './axios';
import { AxiosError } from 'axios';

export const postSignup = async (body: RequestSignupDto): Promise<ResponseSignupDto> => {
    try {
        console.log('Sending signup request with data:', body);
        const { data } = await axiosInstance.post("/v1/auth/signup", {
            ...body,
            bio: "",
            avatar: ""
        });
        console.log('Signup success response:', data);
        return data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Signup error details:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                errorData: error.response?.data,
                requestData: error.config?.data,
                url: error.config?.url
            });
            
            if (error.response?.data) {
                console.error('Server error message:', error.response.data.message);
            }
        }
        throw error;
    }
};

export const postSignin = async (body: RequestSigninDto): Promise<ResponseSigninDto> => {
    const { data } = await axiosInstance.post("/v1/auth/signin", body);
    return data;
};

export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
    const { data } = await axiosInstance.get("/v1/users/me");
    return data;
};


export const postLogout = async () => {
    const { data } = await axiosInstance.post("/v1/auth/signout");
    return data;
}