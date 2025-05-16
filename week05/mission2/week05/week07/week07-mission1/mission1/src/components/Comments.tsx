import React from "react";
import { useParams } from "react-router-dom";
import useGetCommentsByLpId from "../hooks/queries/useGetCommentsByLpId";
import CommentList from "./CommentList";

export default function Comments() {
  const { lpID } = useParams();
  const [order, setOrder] = React.useState<'asc' | 'desc'>('desc');

  const { data, isLoading, isError } = useGetCommentsByLpId({
    lpId: Number(lpID),
    order,
    cursor: 0,
    limit: 10,
  });

  const comments = Array.isArray(data?.data?.data) ? data.data.data : [];

  if (isLoading) return <div>로딩중...</div>;
  if (isError) return <div>댓글을 불러오지 못했습니다.</div>;

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded font-semibold transition ${order === 'asc' ? 'bg-pink-500 text-white' : 'bg-gray-500 text-white'}`}
          onClick={() => setOrder('asc')}
        >오래된순</button>
        <button
          className={`px-3 py-1 rounded font-semibold transition ${order === 'desc' ? 'bg-pink-500 text-white' : 'bg-gray-500 text-white'}`}
          onClick={() => setOrder('desc')}
        >최신순</button>
      </div>
      <CommentList comments={comments} />
    </div>
  );
} 