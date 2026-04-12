"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleLike } from "@/app/actions/likes";

interface LikeButtonProps {
  appId: string;
  initialLiked: boolean;
  initialCount: number;
  size?: "sm" | "md";
}

export function LikeButton({ appId, initialLiked, initialCount, size = "md" }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      try {
        const result = await toggleLike(appId);
        if ("error" in result) return;
        setLiked(result.liked);
        setCount(result.likeCount);
      } catch {
        // 로그인 미로그인 등 — 조용히 실패
      }
    });
  }

  const isSmall = size === "sm";

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-label={liked ? "좋아요 취소" : "좋아요"}
      className={`inline-flex items-center gap-1.5 rounded-full border transition-colors disabled:opacity-50 ${
        liked
          ? "border-red-400/60 bg-red-500/10 text-red-500"
          : "border-border text-muted hover:border-red-400/60 hover:text-red-500"
      } ${isSmall ? "px-2.5 py-1 text-xs" : "px-4 py-2 text-sm font-medium"}`}
    >
      <Heart
        className={`${isSmall ? "h-3.5 w-3.5" : "h-4 w-4"} ${liked ? "fill-red-500" : ""}`}
      />
      <span>{count}</span>
    </button>
  );
}
