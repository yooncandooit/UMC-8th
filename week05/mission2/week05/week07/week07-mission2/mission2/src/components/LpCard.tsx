import React from "react";
import { ResponseLpListDto } from "../types/lp";

type Lp = ResponseLpListDto["data"]["data"][number];

interface LpCardProps {
  lp: Lp;
  onClick: (lpId: number) => void;
}

const LpCard: React.FC<LpCardProps> = ({ lp, onClick }) => (
  <div
    className="bg-[#222] rounded shadow overflow-hidden flex flex-col relative group transition-transform duration-200 cursor-pointer hover:scale-105"
    onClick={() => onClick(lp.id)}
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
        <div className="text-xs text-gray-300 mb-1">{lp.updatedAt ? new Date(lp.updatedAt).toLocaleDateString() : new Date(lp.ceatedAt).toLocaleDateString()}</div>
        <div className="flex items-center gap-1 text-sm">
          <span>👍</span>
          <span>{lp.likes?.length ?? 0}</span>
        </div>
      </div>
    </div>
  </div>
);

export default LpCard; 