import React from "react";
import { Comment } from "../types/common";
import CommentCard from "./CommentCard";

interface CommentListProps {
  comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => (
  <div className="flex flex-col gap-4">
    {comments.length === 0 ? (
      <div className="text-gray-400">아직 댓글이 없습니다.</div>
    ) : (
      comments.map(comment => <CommentCard key={comment.id} comment={comment} />)
    )}
  </div>
);

export default CommentList; 