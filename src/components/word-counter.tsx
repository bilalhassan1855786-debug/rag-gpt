"use client";

interface WordCounterProps {
  value: string;
  maxLength?: number;
  showWords?: boolean;
}

export default function WordCounter({
  value,
  maxLength = 12000,
  showWords = false,
}: WordCounterProps) {
  const characters =
    value.length;

  const words =
    value.trim().length === 0
      ? 0
      : value
          .trim()
          .split(/\s+/)
          .length;

  const percentage =
    Math.min(
      (characters /
        maxLength) *
        100,
      100
    );

  const warning =
    percentage >= 90;

  return (
    <div className="flex items-center gap-2 text-[9px]">
      {showWords && (
        <span className="text-zinc-700">
          {words} words
        </span>
      )}

      <span
        className={
          warning
            ? "text-amber-500"
            : "text-zinc-700"
        }
      >
        {characters.toLocaleString()} /{" "}
        {maxLength.toLocaleString()}
      </span>
    </div>
  );
}