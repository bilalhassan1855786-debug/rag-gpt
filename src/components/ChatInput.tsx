"use client";

import {
  ArrowUp,
  Loader2,
  Paperclip,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";

interface ChatInputProps {
  loading: boolean;
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({
  loading,
  onSend,
  disabled = false,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  const MAX_LENGTH = 12000;

  function resizeTextarea() {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";

    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      180
    )}px`;
  }

  useEffect(() => {
    resizeTextarea();
  }, [value]);

  function submit() {
    const text = value.trim();

    if (!text || loading || disabled) {
      return;
    }

    onSend(text);
    setValue("");

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div className="border-t border-white/10 bg-[#09090b] p-3 sm:p-4">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl transition focus-within:border-white/20">
          <div className="flex items-end gap-2 p-2">
            {/* Attachment placeholder */}
            <button
              type="button"
              disabled
              title="File upload coming soon"
              className="mb-1 hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-zinc-600 sm:flex"
            >
              <Paperclip size={18} />
            </button>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(event) => {
                if (
                  event.target.value.length <=
                  MAX_LENGTH
                ) {
                  setValue(event.target.value);
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="Message BilalGPT..."
              disabled={disabled || loading}
              rows={1}
              className="max-h-[180px] min-h-[44px] flex-1 resize-none overflow-y-auto bg-transparent px-2 py-3 text-sm leading-6 text-white outline-none placeholder:text-zinc-600 disabled:cursor-not-allowed"
            />

            {/* Send */}
            <button
              type="button"
              onClick={submit}
              disabled={
                !value.trim() ||
                loading ||
                disabled
              }
              className="mb-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white text-black transition hover:bg-zinc-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Send message"
            >
              {loading ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <ArrowUp size={18} />
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 pb-2">
            <span className="text-[10px] text-zinc-700">
              Enter to send • Shift + Enter for new line
            </span>

            <span className="text-[10px] text-zinc-700">
              {value.length.toLocaleString()} /{" "}
              {MAX_LENGTH.toLocaleString()}
            </span>
          </div>
        </div>

        <p className="mt-2 text-center text-[10px] text-zinc-700">
          BilalGPT can make mistakes. Verify important
          information.
        </p>
      </div>
    </div>
  );
}