"use client";

import {
  Brain,
  Check,
} from "lucide-react";

interface MemoryBadgeProps {
  active?: boolean;
  count?: number;
  onClick?: () => void;
}

export default function MemoryBadge({
  active = false,
  count = 0,
  onClick,
}: MemoryBadgeProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] transition ${
        active
          ? "border-white/10 bg-white/[0.05] text-zinc-300"
          : "border-white/5 bg-white/[0.02] text-zinc-700"
      }`}
    >
      {active ? (
        <Check size={10} />
      ) : (
        <Brain size={10} />
      )}

      <span>
        {active
          ? `Memory ${
              count > 0
                ? `· ${count}`
                : ""
            }`
          : "Memory off"}
      </span>
    </button>
  );
}