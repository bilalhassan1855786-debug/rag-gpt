"use client";

import {
  ArrowUp,
  Loader2,
} from "lucide-react";

import {
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export default function ChatInput({
  onSend,
  loading = false,
  disabled = false,
  placeholder = "Message BilalGPT...",
  maxLength = 12000,
}: ChatInputProps) {
  const [value, setValue] =
    useState("");

  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea =
      textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";

    textarea.style.height =
      `${Math.min(
        textarea.scrollHeight,
        180
      )}px`;
  }, [value]);

  function send() {
    const text =
      value.trim();

    if (
      !text ||
      loading ||
      disabled
    ) {
      return;
    }

    onSend(text);
    setValue("");

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      send();
    }
  }

  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#111113] transition focus-within:border-white/20">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) =>
          setValue(
            event.target.value.slice(
              0,
              maxLength
            )
          )
        }
        onKeyDown={handleKeyDown}
        disabled={
          loading || disabled
        }
        rows={1}
        placeholder={placeholder}
        className="block max-h-[180px] min-h-[52px] w-full resize-none bg-transparent px-4 pb-12 pt-4 text-sm leading-6 text-zinc-200 outline-none placeholder:text-zinc-600"
      />

      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
        <span className="text-[9px] text-zinc-700">
          {value.length > 0
            ? `${value.length.toLocaleString()} / ${maxLength.toLocaleString()}`
            : "Enter to send"}
        </span>

        <button
          type="button"
          onClick={send}
          disabled={
            loading ||
            disabled ||
            !value.trim()
          }
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600"
          aria-label="Send message"
        >
          {loading ? (
            <Loader2
              size={15}
              className="animate-spin"
            />
          ) : (
            <ArrowUp size={16} />
          )}
        </button>
      </div>
    </div>
  );
}