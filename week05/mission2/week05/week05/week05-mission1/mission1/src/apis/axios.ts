import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8000"
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    console.log('Request interceptor - Current token:', token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Request headers:', config.headers);
    } else {
        console.warn('No token found in localStorage');
    }
    return config;
});