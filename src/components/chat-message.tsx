"use client";

import {
  Bot,
  Check,
  Copy,
  User,
} from "lucide-react";

import {
  useState,
} from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: number;
  isStreaming?: boolean;
}

export default function ChatMessage({
  role,
  content,
  timestamp,
  isStreaming = false,
}: ChatMessageProps) {
  const [copied, setCopied] =
    useState(false);

  const isUser =
    role === "user";

  async function copyContent() {
    try {
      await navigator.clipboard.writeText(
        content
      );

      setCopied(true);

      setTimeout(
        () => setCopied(false),
        1500
      );
    } catch (error) {
      console.error(
        "Copy failed:",
        error
      );
    }
  }

  return (
    <div
      className={`group flex gap-3 ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
          <Bot size={15} />
        </div>
      )}

      <div
        className={`max-w-[88%] sm:max-w-[78%] ${
          isUser
            ? "rounded-2xl bg-white px-4 py-3 text-black"
            : "py-1 text-zinc-200"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm leading-6">
            {content}
          </p>
        ) : (
          <div className="text-sm leading-7">
            <ReactMarkdown
              remarkPlugins={[
                remarkGfm,
              ]}
            >
              {content}
            </ReactMarkdown>

            {isStreaming && (
              <span className="ml-1 inline-block h-4 w-1 animate-pulse rounded bg-zinc-400 align-middle" />
            )}
          </div>
        )}

        {!isUser &&
          content && (
            <button
              type="button"
              onClick={copyContent}
              className="mt-2 flex items-center gap-1 rounded-md px-2 py-1 text-[10px] text-zinc-700 opacity-0 transition hover:bg-white/5 hover:text-zinc-300 group-hover:opacity-100"
            >
              {copied ? (
                <>
                  <Check size={11} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={11} />
                  Copy
                </>
              )}
            </button>
          )}

        {timestamp && (
          <p
            className={`mt-1 text-[9px] ${
              isUser
                ? "text-black/40"
                : "text-zinc-700"
            }`}
          >
            {new Date(
              timestamp
            ).toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
          </p>
        )}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white text-black">
          <User size={14} />
        </div>
      )}
    </div>
  );
}