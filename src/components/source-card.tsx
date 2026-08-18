"use client";

import {
  ExternalLink,
  FileText,
} from "lucide-react";

interface SourceCardProps {
  title: string;
  url: string;
  category?: string;
  description?: string;
}

export default function SourceCard({
  title,
  url,
  category,
  description,
}: SourceCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl border border-white/10 bg-white/[0.02] p-3 transition hover:border-white/15 hover:bg-white/[0.05]"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
          <FileText
            size={14}
            className="text-zinc-500"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-xs font-medium text-zinc-300 group-hover:text-white">
              {title}
            </p>

            <ExternalLink
              size={12}
              className="flex-shrink-0 text-zinc-700 group-hover:text-zinc-300"
            />
          </div>

          {category && (
            <span className="mt-1 inline-block rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[8px] text-zinc-600">
              {category}
            </span>
          )}

          {description && (
            <p className="mt-2 line-clamp-2 text-[10px] leading-4 text-zinc-600">
              {description}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}