import React from "react";
import { Comment } from "../types/common";

interface CommentCardProps {
  comment: Comment;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => (
  <div className="flex items-start gap-3">
    <img src={comment.author.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${comment.author.name}`} alt={comment.author.name} className="w-8 h-8 rounded-full" />
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <span className="text-white font-semibold text-sm">{comment.author.name}</span>
        <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="text-gray-200 text-sm mt-1">{comment.content}</div>
    </div>
  </div>
);

export default CommentCard; 