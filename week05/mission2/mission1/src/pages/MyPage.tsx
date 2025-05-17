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
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-md text-center">
          <h1 className="text-xl font-bold text-gray-800 mb-6">
            {data?.data.name} 님, 환영합니다!
          </h1>
          <button
            className="w-full py-2 rounded-md text-white font-semibold bg-indigo-500 hover:bg-indigo-600 transition"
            onClick={handleLogout}
          >
            logout
          </button>
        </div>
      </div>
    );    
};

export default MyPage;