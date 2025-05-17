import { useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

const GoogleLoginRedirect = () => {
    const { setItem: setAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const { setItem: setRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
    useEffect(() => {
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get("accessToken");
        const refreshToken = urlParams.get("refreshToken");
        if (accessToken) {
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            window.location.href = "/my";
        }
    }, [setAccessToken, setRefreshToken]);
    return (
        <div>GoogleLoginRedirect</div>
    )
}

export default GoogleLoginRedirect