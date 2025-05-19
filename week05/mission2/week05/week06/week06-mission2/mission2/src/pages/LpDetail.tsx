import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../apis/lp";
import { ResponseLpDetailDto } from "../types/lp";
import useGetCommentsByLpId from "../hooks/queries/useGetCommentsByLpId";
import CommentList from "../components/CommentList";

function formatDate(date: string | Date) {
    const d = new Date(date);
    return d.toLocaleDateString("ko-KR", { year: "numeric", month: "short", day: "numeric" });
}

const LpDetail = () => {
    const { LPid } = useParams();
    const { data, isLoading, isError } = useQuery<ResponseLpDetailDto>({
        queryKey: ["lpDetail", LPid],
        queryFn: () => getLpDetail(Number(LPid)),
        enabled: !!LPid,
    });

    const [commentOrder, setCommentOrder] = React.useState<'asc' | 'desc'>('desc');
    const { data: commentsData } = useGetCommentsByLpId({ lpId: Number(LPid), order: commentOrder, cursor: 0, limit: 10 });
    const comments: import("../types/common").Comment[] = Array.isArray(commentsData?.data) ? commentsData.data : [];

    if (isLoading) return <div className="text-white">Loading...</div>;
    if (isError || !data) return <div className="text-white">Error</div>;

    const lp = data.data;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
            <div className="bg-[#23232b] rounded-2xl shadow-xl p-8 w-full max-w-2xl flex flex-col items-center relative">
                {/* 아티스트, 제목, 날짜 */}
                <div className="flex items-center w-full justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <img src="https://api.dicebear.com/7.x/identicon/svg?seed=otanian" alt="artist" className="w-8 h-8 rounded-full" />
                        <span className="text-white font-semibold">아티스트ㅇㅇㅇ</span>
                    </div>
                    <span className="text-gray-400 text-sm">{formatDate(lp.updatedAt)}</span>
                </div>
                <div className="text-white text-2xl font-bold mb-4 w-full text-left">{lp.title}</div>
                {/* 썸네일 */}
                <div className="flex justify-center w-full mb-6">
                    <img src={lp.thumbnail} alt={lp.title} className="w-64 h-64 object-cover rounded-xl shadow-lg" />
                </div>
                {/* 설명 */}
                <div className="text-gray-200 text-center mb-4">{lp.content}</div>
                {/* 태그 */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {lp.tags.map(tag => (
                        <span key={tag.id} className="bg-[#23232b] border border-[#ff3399] text-[#ff3399] px-3 py-1 rounded-full text-xs">#{tag.name}</span>
                    ))}
                </div>
                {/* 버튼 영역 */}
                <div className="flex items-center gap-4 mt-2">
                    <button className="p-2 rounded-full bg-[#23232b] border border-gray-600 text-gray-400 hover:text-[#ff3399] hover:border-[#ff3399] transition">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h18" /></svg>
                    </button>
                    <button className="p-2 rounded-full bg-[#23232b] border border-gray-600 text-gray-400 hover:text-[#ff3399] hover:border-[#ff3399] transition">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v2H7V5a2 2 0 012-2z" /></svg>
                    </button>
                    <button className="flex items-center gap-1 p-2 rounded-full bg-[#ff3399] text-white hover:bg-[#ff3399]/80 transition">
                        <span>❤️</span>
                        <span>{lp.likes?.length ?? 0}</span>
                    </button>
                </div>
                {/* 댓글 영역 */}
                <div className="mt-4 w-full">
                    <h2 className="text-white text-xl font-bold mb-2">댓글</h2>
                    {/* 댓글 입력란 (디자인만) */}
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            className="flex-1 p-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
                            placeholder="댓글을 입력해주세요"
                            disabled
                        />
                        <button className="px-4 py-2 rounded bg-[#ff3399] text-white font-semibold opacity-60 cursor-not-allowed">작성</button>
                    </div>
                    {/* 정렬 버튼 */}
                    <div className="flex gap-2 mb-4">
                        <button
                            className={`px-3 py-1 rounded font-semibold transition ${commentOrder === 'asc' ? 'bg-[#ff3399] text-white' : 'bg-gray-700 text-white hover:bg-[#ff3399]/80 hover:text-white'}`}
                            onClick={() => setCommentOrder('asc')}
                        >오래된순</button>
                        <button
                            className={`px-3 py-1 rounded font-semibold transition ${commentOrder === 'desc' ? 'bg-[#ff3399] text-white' : 'bg-gray-700 text-white hover:bg-[#ff3399]/80 hover:text-white'}`}
                            onClick={() => setCommentOrder('desc')}
                        >최신순</button>
                    </div>
                    {/* 댓글 리스트 */}
                    <CommentList comments={comments} />
                </div>
            </div>
        </div>
    );
};

export default LpDetail; 