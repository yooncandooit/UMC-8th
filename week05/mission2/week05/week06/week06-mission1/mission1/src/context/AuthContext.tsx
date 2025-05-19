import { createContext, PropsWithChildren, useContext, useState } from "react";
import { RequestSigninDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin } from "../apis/auth";

interface AuthContextType { 
    accessToken: string | null;
    refreshToken: string | null;
    login: (signinData:RequestSigninDto) => Promise<boolean>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    login: async () => false,
    logout: async () => { },
});

export const AuthProvider = ({ children }: PropsWithChildren) => { 
    const {getItem:getAccessTokenFromStorage,setItem:setAccessTokenToStorage,removeItem:removeAccessTokenFromStorage }=useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const {getItem:getRefreshTokenFromStorage,setItem:setRefreshTokenToStorage,removeItem:removeRefreshTokenFromStorage }=useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
    const [accessToken, setAccessToken] = useState<string | null>(getAccessTokenFromStorage() ?? null);
    const [refreshToken, setRefreshToken] = useState<string | null>(getRefreshTokenFromStorage() ?? null);

    const login = async (signinData: RequestSigninDto) => {
        try {
            const { data } = await postSignin(signinData);

            if (data) {
                const newAccessToken = data.accessToken;
                const newRefreshToken = data.refreshToken;
    
                setAccessTokenToStorage(newAccessToken);
                setRefreshTokenToStorage(newRefreshToken);
    
                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);

                alert("로그인 성공");
                return true;
            }
            return false;
        }
        catch (error) {
            console.error("로그인 에러", error);
            alert("로그인 실패");
            return false;
        }
    }

    const logout = async () => {
        try {
            await postLogout();
            removeAccessTokenFromStorage();
            removeRefreshTokenFromStorage();

            setAccessToken(null);
            setRefreshToken(null);

            alert("로그아웃 성공");
        } catch (error) {
            console.error("로그아웃오류", error);
            alert("로그아웃 실패");
        }
    }

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("AuthContext를 찾을 수 없습니다.");
    }
    return context
}