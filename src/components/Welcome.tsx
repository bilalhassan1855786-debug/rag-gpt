"use client";

import {
  BookOpen,
  BrainCircuit,
  Code2,
  GraduationCap,
  Sparkles,
} from "lucide-react";

interface WelcomeProps {
  onPick: (text: string) => void;
}

const prompts = [
  {
    icon: GraduationCap,
    title: "Superior University",
    description:
      "Ask about programs, admissions, campuses and public university information.",
    prompt:
      "What programs does Superior University offer?",
  },
  {
    icon: BrainCircuit,
    title: "Learn AI",
    description:
      "Understand AI, RAG, embeddings, agents and modern AI development.",
    prompt:
      "Explain RAG and embeddings in simple Roman Urdu.",
  },
  {
    icon: Code2,
    title: "Build Software",
    description:
      "Get help with Next.js, TypeScript, React, Tailwind and APIs.",
    prompt:
      "Help me build a production-ready Next.js AI chatbot.",
  },
  {
    icon: BookOpen,
    title: "Study Assistant",
    description:
      "Use BilalGPT as your personal study and programming mentor.",
    prompt:
      "Create a learning roadmap for becoming an AI developer.",
  },
];

export default function Welcome({
  onPick,
}: WelcomeProps) {
  return (
    <div className="mx-auto flex min-h-full max-w-4xl flex-col justify-center px-4 py-10 sm:px-6">
      {/* Logo */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-black shadow-[0_20px_60px_rgba(255,255,255,.08)]">
          <Sparkles size={30} />
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          How can I help you?
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-500">
          Your personal AI assistant powered by
          Gemini with backend context, Superior
          University RAG and memory.
        </p>
      </div>

      {/* Capabilities */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {[
          "Gemini",
          "RAG",
          "Memory",
          "Coding",
          "University AI",
        ].map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-zinc-500"
          >
            {item}
          </span>
        ))}
      </div>

      {/* Prompt cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {prompts.map(
          ({
            icon: Icon,
            title,
            description,
            prompt,
          }) => (
            <button
              key={title}
              onClick={() => onPick(prompt)}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-zinc-300 transition group-hover:bg-white group-hover:text-black">
                <Icon size={18} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-white">
                {title}
              </h3>

              <p className="mt-1.5 text-xs leading-5 text-zinc-500">
                {description}
              </p>

              <p className="mt-3 text-xs text-zinc-600 transition group-hover:text-zinc-400">
                Try it →
              </p>
            </button>
          )
        )}
      </div>
    </div>
  );
}