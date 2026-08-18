import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BilalGPT — Personal AI Assistant",

  description:
    "A premium personal AI assistant powered by Gemini, RAG and persistent memory.",

  keywords: [
    "BilalGPT",
    "AI Assistant",
    "Gemini",
    "RAG",
    "Superior University",
    "AI chatbot",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}