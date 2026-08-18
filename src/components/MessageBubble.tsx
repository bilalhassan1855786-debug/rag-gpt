"use client";

import {
  Bot,
  Check,
  Copy,
  ExternalLink,
  User,
} from "lucide-react";
import {
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface MessageSource {
  title: string;
  url: string;
  category: string;
  score?: number;
}

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  sources?: MessageSource[];
}

export default function MessageBubble({
  role,
  content,
  sources = [],
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const isUser = role === "user";

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(
        content
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error(
        "Failed to copy message:",
        error
      );
    }
  }

  return (
    <article className="mb-8 flex gap-3 sm:gap-4">
      {/* Avatar */}
      <div
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${
          isUser
            ? "bg-white text-black"
            : "border border-white/10 bg-white/[0.06] text-white"
        }`}
      >
        {isUser ? (
          <User size={17} />
        ) : (
          <Bot size={18} />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="mb-2 text-sm font-semibold text-white">
          {isUser ? "You" : "BilalGPT"}
        </div>

        <div className="markdown max-w-none text-sm leading-7 text-zinc-200">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({
                children,
              }: ComponentPropsWithoutRef<"h1">) => (
                <h1 className="mb-4 mt-6 text-2xl font-bold text-white first:mt-0">
                  {children}
                </h1>
              ),

              h2: ({
                children,
              }: ComponentPropsWithoutRef<"h2">) => (
                <h2 className="mb-3 mt-5 text-xl font-bold text-white">
                  {children}
                </h2>
              ),

              h3: ({
                children,
              }: ComponentPropsWithoutRef<"h3">) => (
                <h3 className="mb-2 mt-4 text-lg font-semibold text-white">
                  {children}
                </h3>
              ),

              p: ({
                children,
              }: ComponentPropsWithoutRef<"p">) => (
                <p className="mb-3 last:mb-0">
                  {children}
                </p>
              ),

              ul: ({
                children,
              }: ComponentPropsWithoutRef<"ul">) => (
                <ul className="mb-4 ml-5 list-disc space-y-1">
                  {children}
                </ul>
              ),

              ol: ({
                children,
              }: ComponentPropsWithoutRef<"ol">) => (
                <ol className="mb-4 ml-5 list-decimal space-y-1">
                  {children}
                </ol>
              ),

              li: ({
                children,
              }: ComponentPropsWithoutRef<"li">) => (
                <li>{children}</li>
              ),

              blockquote: ({
                children,
              }: ComponentPropsWithoutRef<"blockquote">) => (
                <blockquote className="my-4 border-l-2 border-white/20 pl-4 italic text-zinc-400">
                  {children}
                </blockquote>
              ),

              a: ({
                children,
                href,
              }: ComponentPropsWithoutRef<"a">) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-200 underline underline-offset-2 hover:text-white"
                >
                  {children}
                </a>
              ),

              code: ({
                className,
                children,
                ...props
              }: ComponentPropsWithoutRef<"code">) => {
                const inline =
                  !className?.includes(
                    "language-"
                  );

                if (inline) {
                  return (
                    <code
                      className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[0.85em] text-zinc-200"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }

                return (
                  <code
                    className={`${className || ""} font-mono text-xs leading-6`}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },

              pre: ({
                children,
              }: ComponentPropsWithoutRef<"pre">) => (
                <pre className="my-4 overflow-x-auto rounded-xl border border-white/10 bg-[#050505] p-4">
                  {children}
                </pre>
              ),

              table: ({
                children,
              }: ComponentPropsWithoutRef<"table">) => (
                <div className="my-4 overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full border-collapse text-sm">
                    {children}
                  </table>
                </div>
              ),

              th: ({
                children,
              }: ComponentPropsWithoutRef<"th">) => (
                <th className="border-b border-white/10 bg-white/5 px-3 py-2 text-left font-semibold">
                  {children}
                </th>
              ),

              td: ({
                children,
              }: ComponentPropsWithoutRef<"td">) => (
                <td className="border-b border-white/5 px-3 py-2">
                  {children}
                </td>
              ),

              hr: () => (
                <hr className="my-5 border-white/10" />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* Actions */}
        {!isUser && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              onClick={copyMessage}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-zinc-500 transition hover:bg-white/5 hover:text-white"
            >
              {copied ? (
                <>
                  <Check size={13} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={13} />
                  Copy
                </>
              )}
            </button>

            {/* Sources */}
            {sources.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {sources
                  .slice(0, 4)
                  .map((source, index) => (
                    <a
                      key={`${source.url}-${index}`}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex max-w-[240px] items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[11px] text-zinc-400 transition hover:bg-white/10 hover:text-white"
                    >
                      <ExternalLink size={11} />

                      <span className="truncate">
                        {source.title}
                      </span>
                    </a>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}