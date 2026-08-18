"use client";

import {
  Brain,
  Code2,
  GraduationCap,
  Lightbulb,
  Sparkles,
} from "lucide-react";

interface WelcomeScreenProps {
  onPrompt: (prompt: string) => void;
}

const prompts = [
  {
    icon: GraduationCap,
    title: "Superior University",
    prompt:
      "What can you tell me about Superior University?",
  },
  {
    icon: Brain,
    title: "Learn AI",
    prompt:
      "Teach me Artificial Intelligence from beginner to advanced.",
  },
  {
    icon: Code2,
    title: "Build a project",
    prompt:
      "Give me a professional Next.js and AI project idea.",
  },
  {
    icon: Lightbulb,
    title: "Solve a problem",
    prompt:
      "Help me solve a real-world problem using AI.",
  },
];

export default function WelcomeScreen({
  onPrompt,
}: WelcomeScreenProps) {
  return (
    <section className="flex min-h-full items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="mb-9 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <Sparkles
              size={25}
              className="text-white"
            />
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Welcome to BilalGPT
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-600">
            Your private AI assistant powered
            by Gemini, RAG and intelligent
            memory.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {prompts.map((item) => {
            const Icon = item.icon;

            return (
              <button
                type="button"
                key={item.title}
                onClick={() =>
                  onPrompt(
                    item.prompt
                  )
                }
                className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-left transition hover:bg-white/[0.05]"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-600 group-hover:text-white">
                  <Icon size={16} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-zinc-300 group-hover:text-white">
                    {item.title}
                  </p>

                  <p className="mt-1 truncate text-[10px] text-zinc-700">
                    {item.prompt}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}