"use client";

import {
  MessageSquarePlus,
  Trash2,
  X,
  Search,
  Settings,
  Brain,
} from "lucide-react";

export interface SidebarChat {
  id: string;
  title: string;
  createdAt: number;
}

interface SidebarProps {
  chats: SidebarChat[];
  activeId: string | null;
  open: boolean;
  onNew: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  onMemory?: () => void;
  onSettings?: () => void;
}

export default function Sidebar({
  chats,
  activeId,
  open,
  onNew,
  onSelect,
  onDelete,
  onClose,
  onMemory,
  onSettings,
}: SidebarProps) {
  return (
    <aside
      className={`${
        open ? "w-72" : "w-0"
      } relative flex-shrink-0 overflow-hidden border-r border-white/10 bg-[#0d0d0f] transition-all duration-300`}
    >
      <div className="flex h-full w-72 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
              <Brain size={19} />
            </div>

            <div>
              <h2 className="text-sm font-semibold">
                BilalGPT
              </h2>

              <p className="text-[10px] text-zinc-500">
                Personal AI
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/10 hover:text-white"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* New Chat */}
        <div className="p-4">
          <button
            onClick={onNew}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 active:scale-[0.98]"
          >
            <MessageSquarePlus size={17} />
            New Chat
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
            <Search
              size={15}
              className="text-zinc-500"
            />

            <input
              type="text"
              placeholder="Search chats..."
              className="w-full bg-transparent text-xs text-white outline-none placeholder:text-zinc-600"
            />
          </div>
        </div>

        {/* Chat history */}
        <div className="flex-1 overflow-y-auto px-3">
          {chats.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <p className="text-xs text-zinc-600">
                No conversations yet.
              </p>

              <p className="mt-1 text-[10px] text-zinc-700">
                Start a new chat to begin.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                Recent Chats
              </div>

              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`group mb-1 flex items-center rounded-xl transition ${
                    activeId === chat.id
                      ? "bg-white/10"
                      : "hover:bg-white/5"
                  }`}
                >
                  <button
                    onClick={() =>
                      onSelect(chat.id)
                    }
                    className="min-w-0 flex-1 truncate px-3 py-3 text-left text-sm text-zinc-300"
                  >
                    {chat.title || "New Chat"}
                  </button>

                  <button
                    onClick={() =>
                      onDelete(chat.id)
                    }
                    className="mr-1 rounded-lg p-2 text-zinc-600 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                    aria-label="Delete chat"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Bottom actions */}
        <div className="space-y-1 border-t border-white/10 p-3">
          <button
            onClick={onMemory}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs text-zinc-400 transition hover:bg-white/5 hover:text-white"
          >
            <Brain size={16} />
            Memory
          </button>

          <button
            onClick={onSettings}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs text-zinc-400 transition hover:bg-white/5 hover:text-white"
          >
            <Settings size={16} />
            Settings
          </button>

          <div className="mt-2 rounded-xl bg-white/[0.03] p-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-[11px] font-medium text-zinc-300">
                AI Online
              </span>
            </div>

            <p className="mt-1 text-[10px] leading-4 text-zinc-600">
              Gemini • RAG • Memory
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}