import axios, { InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";


interface CustominternalAxiosRequestConfig extends InternalAxiosRequestConfig{
    _retry?: boolean;

}

let refreshPromise: Promise<string> | null = null;

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8000",
});

axiosInstance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
},
    (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest: CustominternalAxiosRequestConfig = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            if (originalRequest.url === 'v1/auth/refresh') {
                const { removeItem: removeAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
                const { removeItem: removeRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
                removeAccessToken();
                removeRefreshToken();
                window.location.href = '/login';
                return Promise.reject(error);
            }
            originalRequest._retry = true;
            
            if (!refreshPromise) {
                refreshPromise =(async () => {
                    const { getItem: getRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
                    const refreshToken = getRefreshToken();

                    const { data } = await axiosInstance.post("/v1/auth/refresh", { refresh: refreshToken });

                    const { setItem: setAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
                    const { setItem: setRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

                    setAccessToken(data.data.accessToken);
                    setRefreshToken(data.data.refreshToken);

                    return data.data.accessToken;
                })()
                    .catch((error) => {
                        const { removeItem: removeAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
                        const { removeItem: removeRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
                        removeAccessToken();
                        removeRefreshToken();
                        window.location.href = '/login';
                        return Promise.reject(error);
                    }).finally(() => {
                        refreshPromise = null;
                    });
            }
            return refreshPromise.then((newAccessToken) => {
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosInstance.request(originalRequest);
            });
        }
        return Promise.reject(error);
    }

)
