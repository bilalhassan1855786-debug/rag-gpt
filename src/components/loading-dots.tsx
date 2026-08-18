"use client";

interface LoadingDotsProps {
  text?: string;
}

export default function LoadingDots({
  text = "Thinking",
}: LoadingDotsProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
        <span className="text-xs">
          ✦
        </span>
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] px-3 py-2">
        <span className="text-[11px] text-zinc-600">
          {text}
        </span>

        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-600 [animation-delay:-0.3s]" />

          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-600 [animation-delay:-0.15s]" />

          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-600" />
        </div>
      </div>
    </div>
  );
}