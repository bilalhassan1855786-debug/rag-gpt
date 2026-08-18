"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import ChatHeader from "@/components/chat-header";
import ChatInput from "@/components/chat-input";
import ChatListItem from "@/components/chat-list-item";
import ChatMessage from "@/components/chat-message";
import ChatSidebar, {
  type ChatSidebarItem,
} from "@/components/chat-sidebar";
import ContextDialogue from "@/components/context-dialoge";
import LoadingDots from "@/components/loading-dots";
import MemoryBadge from "@/components/memory-badge";
import SourceCard from "@/components/source-card";
import WelcomeScreen from "@/components/welcome-screen";
import WordCounter from "@/components/word-counter";

interface MessageSource {
  title?: string;
  url?: string;
  category?: string;
  description?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: MessageSource[];
  ragUsed?: boolean;
  memoryUsed?: boolean;
}

interface Chat {
  id: string;
  title: string;
  createdAt: number;
  messages: Message[];
}

const STORAGE_KEY = "bilalgpt_chats_v1";

const SESSION_KEY = "bilalgpt_session_id";

function createId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function createSessionId() {
  if (typeof window === "undefined") {
    return "";
  }

  const existing =
    localStorage.getItem(SESSION_KEY);

  if (existing) {
    return existing;
  }

  const id = createId();

  localStorage.setItem(
    SESSION_KEY,
    id
  );

  return id;
}

export default function Home() {
  const [chats, setChats] =
    useState<Chat[]>([]);

  const [activeChatId, setActiveChatId] =
    useState<string | null>(null);

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [mounted, setMounted] =
    useState(false);

  const [sessionId, setSessionId] =
    useState("");

  const [contextOpen, setContextOpen] =
    useState(false);

  /*
   * Load local chats
   */
  useEffect(() => {
    setMounted(true);

    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (saved) {
      try {
        const parsed =
          JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setChats(parsed);
        }
      } catch {
        localStorage.removeItem(
          STORAGE_KEY
        );
      }
    }

    setSessionId(
      createSessionId()
    );
  }, []);

  /*
   * Save chats
   */
  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(chats)
    );
  }, [chats, mounted]);

  /*
   * Active chat
   */
  const activeChat = useMemo(
    () =>
      chats.find(
        (chat) =>
          chat.id === activeChatId
      ) || null,
    [chats, activeChatId]
  );

  /*
   * Sidebar chat format
   */
  const sidebarChats: ChatSidebarItem[] =
    useMemo(
      () =>
        [...chats]
          .sort(
            (a, b) =>
              b.createdAt -
              a.createdAt
          )
          .map((chat) => ({
            id: chat.id,
            title: chat.title,
            createdAt:
              chat.createdAt,
          })),
      [chats]
    );

  /*
   * Create new chat
   */
  function createNewChat() {
    setActiveChatId(null);
  }

  /*
   * Delete one chat
   */
  function deleteChat(id: string) {
    setChats((current) =>
      current.filter(
        (chat) =>
          chat.id !== id
      )
    );

    if (activeChatId === id) {
      setActiveChatId(null);
    }
  }

  /*
   * Delete all chats
   */
  function clearAllChats() {
    const confirmed =
      window.confirm(
        "Delete all local conversations?"
      );

    if (!confirmed) {
      return;
    }

    setChats([]);
    setActiveChatId(null);
  }

  /*
   * Select chat
   */
  function selectChat(id: string) {
    setActiveChatId(id);

    if (
      window.innerWidth < 768
    ) {
      setSidebarOpen(false);
    }
  }

  /*
   * Send message
   */
  async function sendMessage(
    text: string
  ) {
    if (
      loading ||
      !text.trim()
    ) {
      return;
    }

    const cleanText =
      text.trim();

    setLoading(true);

    let chatId =
      activeChatId;

    /*
     * Create new chat automatically
     */
    if (!chatId) {
      chatId = createId();

      const newChat: Chat = {
        id: chatId,

        title:
          cleanText.length > 45
            ? `${cleanText.slice(
                0,
                45
              )}...`
            : cleanText,

        createdAt: Date.now(),

        messages: [],
      };

      setChats((current) => [
        newChat,
        ...current,
      ]);

      setActiveChatId(chatId);
    }

    /*
     * User message
     */
    const userMessage: Message = {
      id: createId(),
      role: "user",
      content: cleanText,
    };

    /*
     * Assistant placeholder
     */
    const assistantId =
      createId();

    const assistantMessage: Message =
      {
        id: assistantId,
        role: "assistant",
        content: "",
        sources: [],
      };

    /*
     * Add messages immediately
     */
    setChats((current) =>
      current.map((chat) => {
        if (chat.id !== chatId) {
          return chat;
        }

        return {
          ...chat,

          messages: [
            ...chat.messages,
            userMessage,
            assistantMessage,
          ],
        };
      })
    );

    try {
      /*
       * Get previous messages
       */
      const currentChat =
        chats.find(
          (chat) =>
            chat.id === chatId
        );

      const previousMessages =
        currentChat?.messages || [];

      /*
       * Gemini history
       */
      const history = [
        ...previousMessages.map(
          (message) => ({
            role: message.role,
            content:
              message.content,
          })
        ),

        {
          role: "user" as const,
          content: cleanText,
        },
      ];

      /*
       * API request
       */
      const response =
        await fetch(
          "/api/chat",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              sessionId:
                sessionId ||
                createSessionId(),

              message: cleanText,

              history,
            }),
          }
        );

      /*
       * Safer JSON handling
       */
      const responseText =
        await response.text();

      let data: {
        answer?: string;
        error?: string;
        sources?: MessageSource[];
        ragUsed?: boolean;
        memoryUsed?: boolean;
      } = {};

      try {
        data =
          responseText
            ? JSON.parse(
                responseText
              )
            : {};
      } catch {
        throw new Error(
          `Server returned invalid JSON. HTTP ${response.status}`
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Something went wrong."
        );
      }

      /*
       * Update assistant
       */
      setChats((current) =>
        current.map((chat) => {
          if (chat.id !== chatId) {
            return chat;
          }

          return {
            ...chat,

            messages:
              chat.messages.map(
                (message) =>
                  message.id ===
                  assistantId
                    ? {
                        ...message,

                        content:
                          data.answer ||
                          "No response received.",

                        sources:
                          data.sources ||
                          [],

                        ragUsed:
                          data.ragUsed ||
                          false,

                        memoryUsed:
                          data.memoryUsed ||
                          false,
                      }
                    : message
              ),
          };
        })
      );
    } catch (error) {
      console.error(
        "Chat error:",
        error
      );

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to get AI response.";

      setChats((current) =>
        current.map((chat) => {
          if (chat.id !== chatId) {
            return chat;
          }

          return {
            ...chat,

            messages:
              chat.messages.map(
                (message) =>
                  message.id ===
                  assistantId
                    ? {
                        ...message,

                        content: `Sorry, I couldn't process your request.

**Error:** ${errorMessage}`,
                      }
                    : message
              ),
          };
        })
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * Context information
   */
  const latestAssistantMessage =
    activeChat?.messages
      .slice()
      .reverse()
      .find(
        (message) =>
          message.role ===
          "assistant" &&
          message.content
      );

  const latestSources =
    latestAssistantMessage
      ?.sources || [];

  /*
   * Loading screen
   */
  if (!mounted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#09090b] text-white">
        <div className="text-center">
          <div className="mb-3 text-2xl">
            ✦
          </div>

          <p className="text-xs text-zinc-600">
            Loading BilalGPT...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-screen overflow-hidden bg-[#09090b] text-white">
      {/* =========================================
          SIDEBAR
      ========================================= */}

      <ChatSidebar
        chats={sidebarChats}
        activeId={activeChatId}
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
        onNewChat={
          createNewChat
        }
        onSelectChat={
          selectChat
        }
        onDeleteChat={
          deleteChat
        }
        onMemory={() =>
          setContextOpen(true)
        }
        onSettings={() =>
          alert(
            "Settings panel will be added next."
          )
        }
      />

      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <section className="relative flex min-w-0 flex-1 flex-col">
        {/* Header */}

        <ChatHeader
          title="BilalGPT"
          onMenuClick={() =>
            setSidebarOpen(true)
          }
          onNewChat={
            createNewChat
          }
        />

        {/* =======================================
            CHAT AREA
        ======================================= */}

        <div className="min-h-0 flex-1 overflow-y-auto">
          {activeChat &&
          activeChat.messages.length >
            0 ? (
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
              {/* Messages */}

              <div className="space-y-7">
                {activeChat.messages.map(
                  (message) => (
                    <div
                      key={
                        message.id
                      }
                    >
                      <ChatMessage
                        role={
                          message.role
                        }
                        content={
                          message.content ||
                          (loading &&
                          message.role ===
                            "assistant"
                            ? ""
                            : "")
                        }
                        isStreaming={
                          loading &&
                          message.role ===
                            "assistant" &&
                          message.id ===
                            activeChat.messages[
                              activeChat
                                .messages
                                .length -
                                1
                            ]?.id
                        }
                      />

                      {/* RAG Sources */}

                      {message.role ===
                        "assistant" &&
                        message.sources &&
                        message.sources.length >
                          0 && (
                          <div className="mt-3 ml-11 max-w-2xl">
                            <div className="mb-2 flex items-center gap-2">
                              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-700">
                                Sources
                              </span>

                              <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[9px] text-zinc-600">
                                {
                                  message
                                    .sources
                                    .length
                                }
                              </span>
                            </div>

                            <div className="grid gap-2 sm:grid-cols-2">
                              {message.sources.map(
                                (
                                  source,
                                  index
                                ) =>
                                  source.url ? (
                                    <SourceCard
                                      key={`${message.id}-${index}`}
                                      title={
                                        source.title ||
                                        "Knowledge source"
                                      }
                                      url={
                                        source.url
                                      }
                                      category={
                                        source.category
                                      }
                                      description={
                                        source.description
                                      }
                                    />
                                  ) : null
                              )}
                            </div>
                          </div>
                        )}

                      {/* Memory / RAG badge */}

                      {message.role ===
                        "assistant" &&
                        message.content && (
                          <div className="ml-11 mt-2 flex items-center gap-2">
                            {message.memoryUsed && (
                              <MemoryBadge
                                active={
                                  true
                                }
                                onClick={() =>
                                  setContextOpen(
                                    true
                                  )
                                }
                              />
                            )}

                            {message.ragUsed && (
                              <button
                                type="button"
                                onClick={() =>
                                  setContextOpen(
                                    true
                                  )
                                }
                                className="rounded-full border border-white/5 bg-white/[0.02] px-2.5 py-1 text-[10px] text-zinc-600 transition hover:bg-white/5 hover:text-zinc-300"
                              >
                                RAG context
                              </button>
                            )}
                          </div>
                        )}
                    </div>
                  )
                )}
              </div>

              {/* Loading */}

              {loading && (
                <div className="mt-6">
                  <LoadingDots />
                </div>
              )}

              {/* Latest response info */}

              {!loading &&
                latestAssistantMessage && (
                  <div className="mt-6 flex items-center gap-3">
                    {latestAssistantMessage
                      .memoryUsed && (
                      <MemoryBadge
                        active
                        onClick={() =>
                          setContextOpen(
                            true
                          )
                        }
                      />
                    )}

                    {latestSources.length >
                      0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setContextOpen(
                            true
                          )
                        }
                        className="text-[10px] text-zinc-700 hover:text-zinc-400"
                      >
                        {latestSources.length}{" "}
                        source
                        {latestSources.length !==
                        1
                          ? "s"
                          : ""}
                      </button>
                    )}
                  </div>
                )}
            </div>
          ) : (
            <WelcomeScreen
              onPrompt={sendMessage}
            />
          )}
        </div>

        {/* =======================================
            INPUT AREA
        ======================================= */}

        <div className="border-t border-white/5 bg-[#09090b]/95 px-3 py-3 backdrop-blur-xl sm:px-5">
          <div className="mx-auto max-w-4xl">
            <ChatInput
              loading={loading}
              onSend={sendMessage}
              placeholder="Message BilalGPT..."
              maxLength={12000}
            />

            <div className="mt-2 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-zinc-700">
                  Gemini
                </span>

                <span className="text-zinc-800">
                  •
                </span>

                <span className="text-[9px] text-zinc-700">
                  RAG
                </span>

                <span className="text-zinc-800">
                  •
                </span>

                <span className="text-[9px] text-zinc-700">
                  Memory
                </span>
              </div>

              <WordCounter
                value=""
                maxLength={12000}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          CONTEXT DIALOGUE
      ========================================= */}

      <ContextDialogue
        open={contextOpen}
        onClose={() =>
          setContextOpen(false)
        }
        ragUsed={
          latestAssistantMessage?.ragUsed ||
          false
        }
        memoryUsed={
          latestAssistantMessage?.memoryUsed ||
          false
        }
        sourceCount={
          latestSources.length
        }
      />
    </main>
  );
}