import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import { ResponseMyInfoDto } from "../types/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState<ResponseMyInfoDto>();

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await getMyInfo();
                console.log("MyInfo response:", response);
                setData(response);
            } catch (error) {
                console.error("사용자 정보 조회 실패:", error);
            }
        };
        getData();
    }, []);
    
    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
            <h1 className="text-white text-2xl font-bold mb-4">{data?.data.name}님 환영합니다</h1>
            <button 
                className="text-white cursor-pointer bg-[#ff3399] rounded-md p-3 hover:bg-[#FFC0CB] transition-colors" 
                onClick={handleLogout}
            >
                로그아웃
            </button>
        </div>
    );
};

export default MyPage;