import React from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getLpDetail, postComment } from "../apis/lp";
import { ResponseLpDetailDto } from "../types/lp";
import useGetCommentsByLpId from "../hooks/queries/useGetCommentsByLpId";
import { useQuery as useReactQuery } from "@tanstack/react-query";
import { getMyInfo } from "../apis/auth";
import { useLpLikeMutation } from "../hooks/mutations/useLpLikeMutation";
import { useCommentMutations } from "../hooks/mutations/useCommentMutations";
import { useLpMutation } from "../hooks/mutations/useLpMutation";

function formatDate(date: string | Date) {
    const d = new Date(date);
    return d.toLocaleDateString("ko-KR", { year: "numeric", month: "short", day: "numeric" });
}

const LpDetail = () => {
    const { LPid } = useParams();
    const { data, isLoading, isError, refetch: refetchLpDetail } = useQuery<ResponseLpDetailDto>({
        queryKey: ["lpDetail", LPid],
        queryFn: () => getLpDetail(Number(LPid)),
        enabled: !!LPid,
    });

    const [commentOrder, setCommentOrder] = React.useState<'asc' | 'desc'>('desc');
    const { data: commentsData, isLoading: commentsLoading, refetch } = useGetCommentsByLpId({
        lpId: Number(LPid),
        order: commentOrder,
        cursor: 0,
        limit: 10 

    });
    const comments = commentsData?.data?.data || [];

    const [commentInput, setCommentInput] = React.useState("");

    const mutation = useMutation({
        mutationFn: ({ lpId, content }: { lpId: number; content: string }) => postComment(lpId, content),
        onSuccess: () => {
            setCommentInput("");
            refetch();
        }
    });

    // 댓글 수정 상태 관리
    const [editCommentId, setEditCommentId] = React.useState<number | null>(null);
    const [editCommentContent, setEditCommentContent] = React.useState("");

    // 현재 로그인한 유저 정보 가져오기
    const { data: myInfoData } = useReactQuery({
        queryKey: ["myInfo"],
        queryFn: getMyInfo
    });
    const myId = myInfoData?.data?.id;
    // 메뉴 상태 관리
    const [menuOpenId, setMenuOpenId] = React.useState<number | null>(null);

    const { like, unlike } = useLpLikeMutation(refetchLpDetail);
    const { edit: editComment, remove: removeComment } = useCommentMutations(refetch);
    const { deleteMutation, editMutation } = useLpMutation(refetchLpDetail);

    React.useEffect(() => {
        if (editComment.isSuccess) {
            setEditCommentId(null);
        }
    }, [editComment.isSuccess]);

    // 좋아요 상태 판별
    const isLiked = data?.data.likes?.some(like => like.userId === myId);

    // 좋아요 버튼 클릭 핸들러
    const handleLikeClick = () => {
        if (isLiked) {
            // Optimistically remove like
            const updatedLikes = data?.data.likes?.filter(like => like.userId !== myId) || [];
            const updatedLp = { ...data?.data, likes: updatedLikes };
            refetchLpDetail({ data: { data: updatedLp } });
            
            // Then make the actual API call
            unlike.mutate(Number(LPid), {
                onError: () => {
                    // Revert on error
                    refetchLpDetail();
                }
            });
        } else {
            // Optimistically add like
            const newLike = { userId: myId, lpId: Number(LPid) };
            const updatedLikes = [...(data?.data.likes || []), newLike];
            const updatedLp = { ...data?.data, likes: updatedLikes };
            refetchLpDetail({ data: { data: updatedLp } });
            
            // Then make the actual API call
            like.mutate(Number(LPid), {
                onError: () => {
                    // Revert on error
                    refetchLpDetail();
                }
            });
        }
    };

    // LP 수정 관련 상태
    const [editModalOpen, setEditModalOpen] = React.useState(false);
    const [editTitle, setEditTitle] = React.useState("");
    const [editLpContent, setEditLpContent] = React.useState("");
    const [editTags, setEditTags] = React.useState<string[]>([]);
    const [newTag, setNewTag] = React.useState("");
    const [editThumbnail, setEditThumbnail] = React.useState("");
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleThumbnailClick = () => {
        fileInputRef.current?.click();
    };

    // LP 수정 모달 열 때 초기값 설정
    const handleEditClick = () => {
        if (data?.data) {
            setEditTitle(data.data.title);
            setEditLpContent(data.data.content);
            setEditTags(data.data.tags.map(tag => tag.name));
            setEditThumbnail(data.data.thumbnail);
        }
        setEditModalOpen(true);
    };

    // 썸네일 파일 선택 핸들러
    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditThumbnail(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // 태그 추가 핸들러
    const handleAddTag = () => {
        if (newTag.trim() && !editTags.includes(newTag.trim())) {
            setEditTags([...editTags, newTag.trim()]);
            setNewTag("");
        }
    };

    // 태그 삭제 핸들러
    const handleRemoveTag = (tagToRemove: string) => {
        setEditTags(editTags.filter(tag => tag !== tagToRemove));
    };

    if (isLoading) return <div className="text-white">Loading...</div>;
    if (isError || !data) return <div className="text-white">Error</div>;

    const lp = data.data;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
            <div className="bg-[#23232b] rounded-2xl shadow-xl p-8 w-full max-w-2xl flex flex-col items-center relative">
                {/* 아티스트, 제목, 날짜 */}
                <div className="flex items-center w-full justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <img src={lp.authorId ? `https://api.dicebear.com/7.x/identicon/svg?seed=${lp.authorId}` : "https://api.dicebear.com/7.x/identicon/svg?seed=otanian"} alt="artist" className="w-8 h-8 rounded-full" />
                        <span className="text-white font-semibold">{lp.author.name}</span>
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
                    {myId === lp.authorId && (
                        <>
                            <button 
                                className="p-2 rounded-full bg-[#23232b] border border-gray-600 text-gray-400 hover:text-[#ff3399] hover:border-[#ff3399] transition"
                                onClick={handleEditClick}
                            >
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h18" /></svg>
                            </button>
                            <button 
                                className="p-2 rounded-full bg-[#23232b] border border-gray-600 text-gray-400 hover:text-[#ff3399] hover:border-[#ff3399] transition"
                                onClick={() => deleteMutation.mutate(Number(LPid))}
                            >
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v2H7V5a2 2 0 012-2z" /></svg>
                            </button>
                        </>
                    )}
                    <button
                        className={`flex items-center gap-1 p-2 rounded-full ${isLiked ? 'bg-[#ff3399] text-white' : 'p-2 rounded-full bg-[#23232b] border border-gray-600 text-gray-400'} hover:text-[#ff3399]/80 transition hover:border-[#ff3399] transition`}
                        onClick={handleLikeClick}
                        disabled={like.isPending || unlike.isPending}
                    >
                        <span>👍</span>
                        <span>{lp.likes?.length ?? 0}</span>
                    </button>
                </div>

                {/* LP 수정 모달 */}
                {editModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-[#23232b] p-6 rounded-xl w-full max-w-md">
                            <h2 className="text-white text-xl font-bold mb-4">LP 수정</h2>
                            {/* 썸네일 미리보기 및 업로드 */}
                            <div className="flex flex-col items-center mb-4">
                                <img
                                    src={editThumbnail}
                                    alt="썸네일 미리보기"
                                    className="w-32 h-32 object-cover rounded mb-2 cursor-pointer"
                                    onClick={handleThumbnailClick}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                />

                            </div>
                            <input
                                className="w-full mb-2 p-2 rounded bg-gray-800 text-white"
                                value={editTitle}
                                onChange={e => setEditTitle(e.target.value)}
                                placeholder="제목"
                            />
                            <textarea
                                className="w-full mb-2 p-2 rounded bg-gray-800 text-white"
                                value={editLpContent}
                                onChange={e => setEditLpContent(e.target.value)}
                                placeholder="내용"
                                rows={4}
                            />
                            {/* 태그 입력 */}
                            <div className="mb-4">
                                <div className="flex gap-2 mb-2">
                                    <input
                                        className="flex-1 p-2 rounded bg-gray-800 text-white"
                                        value={newTag}
                                        onChange={e => setNewTag(e.target.value)}
                                        placeholder="태그 입력"
                                        onKeyPress={e => e.key === 'Enter' && handleAddTag()}
                                    />
                                    <button
                                        className="px-4 py-2 rounded bg-[#ff3399] text-white"
                                        onClick={handleAddTag}
                                    >
                                        추가
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {editTags.map(tag => (
                                        <span
                                            key={tag}
                                            className="bg-[#23232b] border border-[#ff3399] text-[#ff3399] px-3 py-1 rounded-full text-xs flex items-center gap-1"
                                        >
                                            #{tag}
                                            <button
                                                onClick={() => handleRemoveTag(tag)}
                                                className="text-[#ff3399] hover:text-white"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    className="px-4 py-2 rounded bg-gray-600 text-white"
                                    onClick={() => setEditModalOpen(false)}
                                >
                                    취소
                                </button>
                                <button
                                    className="px-4 py-2 rounded bg-[#ff3399] text-white"
                                    onClick={() => {
                                        console.log("Edit button clicked");
                                        editMutation.mutate(
                                            {
                                                lpId: Number(LPid),
                                                data: {
                                                    title: editTitle,
                                                    content: editLpContent,
                                                    tags: editTags,
                                                    thumbnail: editThumbnail,
                                                    published: lp.published
                                                }
                                            },
                                            {
                                                onSuccess: () => {
                                                    setEditModalOpen(false);
                                                }
                                            }
                                        );
                                    }}
                                    disabled={editMutation.isPending || !editTitle.trim() || !editLpContent.trim()}
                                >
                                    {editMutation.isPending ? "수정 중..." : "수정"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 댓글 영역 */}
                <div className="mt-4 w-full">
                    <h2 className="text-white text-xl font-bold mb-2">댓글</h2>
                    {/* 댓글 입력란 */}
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            className="flex-1 p-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
                            placeholder="댓글을 입력해주세요"
                            value={commentInput}
                            onChange={e => setCommentInput(e.target.value)}
                            disabled={mutation.isPending}
                        />
                        <button
                            className={`px-4 py-2 rounded bg-[#ff3399] text-white font-semibold ${mutation.isPending || !commentInput.trim() ? 'opacity-60 cursor-not-allowed' : ''}`}
                            onClick={() => mutation.mutate({ lpId: Number(LPid), content: commentInput })}
                            disabled={mutation.isPending || !commentInput.trim()}
                        >
                            {mutation.isPending ? "등록 중..." : "작성"}
                        </button>
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
                    {commentsLoading ? (
                        <div className="text-gray-400 text-center py-8">댓글을 불러오는 중...</div>
                    ) : comments.length === 0 ? (
                        <div className="text-gray-400 text-center py-8">아직 댓글이 없습니다.</div>
                    ) : (
                        <div>
                            {comments.map(comment => (
                                <div key={comment.id} className="flex items-start gap-2 py-2 relative">
                                    <img
                                        src={comment.author.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                        alt={comment.author.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <div>
                                        <div className="font-bold text-white">{comment.author.name}</div>
                                        {editCommentId === comment.id ? (  
                                            <div className="flex gap-2 items-center">   
                                                <input
                                                    type="text"
                                                    className="p-1 rounded bg-gray-800 text-white border border-gray-600"
                                                    value={editCommentContent}
                                                    onChange={e => setEditCommentContent(e.target.value)}
                                                />
                                                <button
                                                    className="text-[#ff3399] font-bold px-2"
                                                    onClick={() => {
                                                        editComment.mutate(
                                                            { lpId: Number(LPid), commentId: comment.id, content: editCommentContent },
                                                            {
                                                                onSuccess: () => {
                                                                    setEditCommentId(null);
                                                                }
                                                            }
                                                        );
                                                    }}
                                                    disabled={editComment.isPending || !editCommentContent.trim()}
                                                >저장</button>
                                                <button
                                                    className="text-gray-400 px-2"
                                                    onClick={() => setEditCommentId(null)}
                                                >취소</button>
                                            </div>
                                        ) : (
                                            <div className="text-gray-200">{comment.content}</div>
                                        )}
                                    </div>
                                    {/* 본인 댓글에만 메뉴 버튼 노출 */}
                                    {myId === comment.author.id && (
                                        <div className="ml-auto relative">
                                            <button
                                                onClick={() => setMenuOpenId(menuOpenId === comment.id ? null : comment.id)}
                                                className="p-2"
                                            >
                                                <span className="text-white">⋯</span>
                                            </button>
                                            {menuOpenId === comment.id && (
                                                <div className="absolute right-0 mt-2 bg-[#23232b] border border-gray-700 rounded shadow-lg z-10 flex flex-row">
                                                    <button
                                                        className="px-4 py-2 text-sm text-white hover:bg-gray-700"
                                                        onClick={() => {
                                                            setMenuOpenId(null);
                                                            setEditCommentId(comment.id);
                                                            setEditCommentContent(comment.content);
                                                        }}
                                                    >
                                                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h18" /></svg>
                                                    </button>
                                                    <button
                                                        className="px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                                                        onClick={() => {
                                                            setMenuOpenId(null);
                                                            removeComment.mutate({ lpId: Number(LPid), commentId: comment.id });
                                                        }}
                                                    >
                                                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v2H7V5a2 2 0 012-2z" /></svg>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LpDetail; 