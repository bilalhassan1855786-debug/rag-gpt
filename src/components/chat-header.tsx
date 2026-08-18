"use client";

import {
  Menu,
  Plus,
  Sparkles,
} from "lucide-react";

interface ChatHeaderProps {
  onMenuClick?: () => void;
  onNewChat?: () => void;
  title?: string;
}

export default function ChatHeader({
  onMenuClick,
  onNewChat,
  title = "BilalGPT",
}: ChatHeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-white/10 bg-[#0b0b0e]/95 px-3 backdrop-blur-xl sm:px-5">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-zinc-500 hover:bg-white/5 hover:text-white md:hidden"
          aria-label="Open menu"
        >
          <Menu size={19} />
        </button>

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
          <Sparkles size={15} />
        </div>

        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-white">
            {title}
          </h1>

          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

            <span className="text-[9px] text-zinc-600">
              Gemini AI
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onNewChat}
        className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-2 text-xs text-zinc-400 transition hover:bg-white/5 hover:text-white"
      >
        <Plus size={15} />

        <span className="hidden sm:inline">
          New chat
        </span>
      </button>
    </header>
  );
}