import React, { useState } from "react";
import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../../enums/common";
import { ResponseLpListDto } from "../types/lp";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function formatDate(date: string | Date) {
    const d = new Date(date);
    return d.toLocaleDateString("ko-KR", { year: "numeric", month: "short", day: "numeric" });
}

const Home = () => {
    const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.DESC);
    const search = useOutletContext<string>() || "";
    const { data, isPending, isError } = useGetLpList({ order, search: search.length > 0 ? search : undefined });
    const { accessToken } = useAuth();
    const navigate = useNavigate();

    type LpItem = ResponseLpListDto["data"]["data"][number];

    const handleCardClick = (lpId: number) => {
        if (!accessToken) {
            alert("로그인이 필요한 서비스입니다. 로그인을 해주세요!"); 
            navigate("/login");
        } else {
            navigate(`/lp/${lpId}`);
        }
    };

    return (
        <main className="flex-1 bg-black p-8 transition-all duration-200">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl text-[#ff3399] font-bold">LP 리스트</h1>
                <div className="flex gap-2">
                    <button
                        className={`p-2 rounded font-semibold transition
                            ${order === PAGINATION_ORDER.DESC
                                ? 'bg-[#ff3399] text-white shadow-lg ring-2 ring-[#ff3399]'
                                : 'bg-gray-700 text-white hover:bg-[#ff3399]/80 hover:text-white'}
                        `}
                        onClick={() => setOrder(PAGINATION_ORDER.DESC)}
                    >
                        최신순
                    </button>
                    <button
                        className={`p-2 rounded font-semibold transition
                            ${order === PAGINATION_ORDER.ASC
                                ? 'bg-[#ff3399] text-white shadow-lg ring-2 ring-[#ff3399]'
                                : 'bg-gray-700 text-white hover:bg-[#ff3399]/80 hover:text-white'}
                        `}
                        onClick={() => setOrder(PAGINATION_ORDER.ASC)}
                    >
                        오래된 순
                    </button>
                </div>
            </div>
            {isPending && <div className="text-white">Loading...</div>}
            {isError && <div className="text-white">Error</div>}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {data?.map((lp: LpItem) => (
                    <div
                        key={lp.id}
                        className="bg-[#222] rounded shadow overflow-hidden flex flex-col relative group transition-transform duration-200 cursor-pointer hover:scale-105"
                        onClick={() => handleCardClick(lp.id)}
                    >
                        {lp.thumbnail ? (
                            <img
                                src={lp.thumbnail}
                                alt={lp.title}
                                className="w-full aspect-square object-cover"
                            />
                        ) : (
                            <div className="w-full aspect-square bg-gray-700 flex items-center justify-center text-white">No Image</div>
                        )}
                        {/* 호버 */}
                        <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-70 flex flex-col justify-end transition-opacity duration-200">
                            <div className="p-4 text-white">
                                <div className="font-bold text-lg mb-1 truncate">{lp.title}</div>
                                <div className="text-xs text-gray-300 mb-1">{formatDate(lp.updatedAt || lp.ceatedAt)}</div>
                                <div className="flex items-center gap-1 text-sm">
                                    <span>👍</span>
                                    <span>{lp.likes?.length ?? 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default Home;
