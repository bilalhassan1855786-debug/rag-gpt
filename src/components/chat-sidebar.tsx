"use client";

import {
  Brain,
  MessageSquare,
  Plus,
  Settings,
  Sparkles,
  X,
} from "lucide-react";

import ChatListItem from "./chat-list-item";

export interface ChatSidebarItem {
  id: string;
  title: string;
  createdAt: number;
}

interface ChatSidebarProps {
  chats: ChatSidebarItem[];
  activeId?: string | null;
  open: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat?: (id: string) => void;
  onMemory?: () => void;
  onSettings?: () => void;
}

export default function ChatSidebar({
  chats,
  activeId,
  open,
  onClose,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onMemory,
  onSettings,
}: ChatSidebarProps) {
  if (!open) {
    return null;
  }

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
      />

      <aside className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-white/10 bg-[#0b0b0e] md:relative md:z-20">
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
              <Sparkles size={15} />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                BilalGPT
              </p>

              <p className="text-[9px] text-zinc-600">
                Personal AI Assistant
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-600 hover:bg-white/5 hover:text-white md:hidden"
          >
            <X size={17} />
          </button>
        </div>

        <div className="p-3">
          <button
            type="button"
            onClick={onNewChat}
            className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-medium text-zinc-300 hover:bg-white/[0.08] hover:text-white"
          >
            <Plus size={16} />
            New chat
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-2">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-700">
            Conversations
          </p>

          {chats.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <MessageSquare
                size={20}
                className="mx-auto mb-2 text-zinc-800"
              />

              <p className="text-xs text-zinc-700">
                No chats yet
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {chats.map((chat) => (
                <ChatListItem
                  key={chat.id}
                  {...chat}
                  active={
                    chat.id === activeId
                  }
                  onClick={() =>
                    onSelectChat(chat.id)
                  }
                  onDelete={
                    onDeleteChat
                      ? () =>
                          onDeleteChat(
                            chat.id
                          )
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={onMemory}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
          >
            <Brain size={15} />
            Memory
          </button>

          <button
            type="button"
            onClick={onSettings}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
          >
            <Settings size={15} />
            Settings
          </button>
        </div>
      </aside>
    </>
  );
}