"use client";

import {
  Brain,
  Database,
  FileText,
  X,
} from "lucide-react";

interface ContextDialogueProps {
  open: boolean;
  onClose: () => void;
  ragUsed?: boolean;
  memoryUsed?: boolean;
  sourceCount?: number;
}

export default function ContextDialogue({
  open,
  onClose,
  ragUsed = false,
  memoryUsed = false,
  sourceCount = 0,
}: ContextDialogueProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111113] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-white">
              AI Context
            </h2>

            <p className="mt-1 text-[10px] text-zinc-600">
              Context used for this response
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-600 hover:bg-white/5 hover:text-white"
          >
            <X size={17} />
          </button>
        </div>

        <div className="space-y-2 p-4">
          <ContextRow
            icon={Database}
            title="Knowledge Base"
            value={
              ragUsed
                ? `${sourceCount} relevant source${
                    sourceCount === 1
                      ? ""
                      : "s"
                  }`
                : "Not used"
            }
            active={ragUsed}
          />

          <ContextRow
            icon={Brain}
            title="Personal Memory"
            value={
              memoryUsed
                ? "Used"
                : "Not used"
            }
            active={memoryUsed}
          />

          <ContextRow
            icon={FileText}
            title="RAG Retrieval"
            value={
              ragUsed
                ? "Active"
                : "No matching context"
            }
            active={ragUsed}
          />
        </div>

        <div className="border-t border-white/10 px-5 py-4">
          <p className="text-[10px] leading-5 text-zinc-600">
            Your private system instructions,
            API keys and backend context are
            never exposed to the browser.
          </p>
        </div>
      </div>
    </div>
  );
}

function ContextRow({
  icon: Icon,
  title,
  value,
  active,
}: {
  icon: typeof Database;
  title: string;
  value: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04]">
        <Icon
          size={15}
          className={
            active
              ? "text-white"
              : "text-zinc-700"
          }
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-zinc-300">
          {title}
        </p>

        <p className="mt-0.5 text-[10px] text-zinc-600">
          {value}
        </p>
      </div>
    </div>
  );
}