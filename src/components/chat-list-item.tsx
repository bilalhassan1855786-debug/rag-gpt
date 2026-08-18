"use client";

import {
  MessageSquare,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

interface ChatListItemProps {
  id: string;
  title: string;
  active?: boolean;
  createdAt?: number;
  onClick: () => void;
  onDelete?: () => void;
}

function formatDate(
  timestamp?: number
) {
  if (!timestamp) {
    return "";
  }

  const date =
    new Date(timestamp);

  const now = new Date();

  const difference =
    now.getTime() -
    date.getTime();

  const day =
    1000 * 60 * 60 * 24;

  if (difference < day) {
    return "Today";
  }

  if (difference < day * 2) {
    return "Yesterday";
  }

  return date.toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
    }
  );
}

export default function ChatListItem({
  id,
  title,
  active = false,
  createdAt,
  onClick,
  onDelete,
}: ChatListItemProps) {
  return (
    <div
      data-chat-id={id}
      className={`group flex items-center rounded-xl transition ${
        active
          ? "bg-white/[0.08]"
          : "hover:bg-white/[0.04]"
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        className="min-w-0 flex-1 px-3 py-2.5 text-left"
      >
        <div className="flex items-center gap-2">
          <MessageSquare
            size={14}
            className={
              active
                ? "text-white"
                : "text-zinc-600"
            }
          />

          <span
            className={`truncate text-xs ${
              active
                ? "text-zinc-100"
                : "text-zinc-400"
            }`}
          >
            {title || "New conversation"}
          </span>
        </div>

        {createdAt && (
          <p className="mt-1 pl-6 text-[9px] text-zinc-700">
            {formatDate(createdAt)}
          </p>
        )}
      </button>

      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="mr-1 rounded-lg p-2 text-zinc-700 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
          aria-label="Delete chat"
        >
          <Trash2 size={13} />
        </button>
      )}

      {!onDelete && (
        <button
          type="button"
          className="mr-1 rounded-lg p-2 text-zinc-700 opacity-0 group-hover:opacity-100"
          aria-label="More options"
        >
          <MoreHorizontal size={14} />
        </button>
      )}
    </div>
  );
}