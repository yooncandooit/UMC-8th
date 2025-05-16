import React from "react";
import LpSkeleton from "./LpSkeleton";

interface LpSkeletonListProps {
  count?: number;
}

const LpSkeletonList: React.FC<LpSkeletonListProps> = ({ count = 6 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <LpSkeleton key={i} />
    ))}
  </>
);

export default LpSkeletonList; 