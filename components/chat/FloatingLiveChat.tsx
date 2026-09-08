"use client";

import {
  Headphones,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

const broadcastMessages = [
  "👋 Need help choosing a product?",
  "🚚 Free delivery on selected orders",
  "💬 Our support team is online",
];

interface ChatMessage {
  id: number;
  sender: "user" | "support";
  message: string;
}

export default function FloatingLiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBroadcast, setShowBroadcast] = useState(true);
  const [broadcastIndex, setBroadcastIndex] = useState(0);
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "support",
      message: "Hi! How can we help you today?",
    },
  ]);

  // Change the floating broadcast message every 4 seconds.
  useEffect(() => {
    const interval = window.setInterval(() => {
      setBroadcastIndex(
        (current) =>
          (current + 1) % broadcastMessages.length
      );

      setShowBroadcast(true);
    }, 4000);

    return () => window.clearInterval(interval);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = input.trim();

    if (!message) return;

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: Date.now(),
        sender: "user",
        message,
      },
    ]);

    setInput("");
  }

  function openChat() {
    setIsOpen(true);
    setShowBroadcast(false);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating broadcast message */}
      {!isOpen && showBroadcast && (
        <div className="absolute bottom-20 right-0 w-72 animate-[float_3s_ease-in-out_infinite] rounded-2xl border border-emerald-100 bg-white p-4 shadow-xl shadow-slate-300/50">
          <button
            type="button"
            onClick={() => setShowBroadcast(false)}
            className="absolute right-2 top-2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close message"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-3 pr-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <Sparkles className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                NovaShop
              </p>

              <p className="mt-1 text-sm font-medium text-slate-700">
                {broadcastMessages[broadcastIndex]}
              </p>
            </div>
          </div>

          <div className="absolute -bottom-2 right-6 h-4 w-4 rotate-45 border-b border-r border-emerald-100 bg-white" />
        </div>
      )}

      {/* Chat window */}
      {isOpen && (
        <section className="mb-4 flex h-[520px] w-[360px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-400/30">
          {/* Header */}
          <header className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/20">
                  <Headphones className="h-6 w-6" />

                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-emerald-600 bg-lime-400" />
                </div>

                <div>
                  <h2 className="font-bold">NovaShop Support</h2>
                  <p className="text-xs text-emerald-100">
                    Online • Usually replies instantly
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 transition hover:bg-white/20"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
            <p className="text-center text-xs text-slate-400">
              Today
            </p>

            {messages.map((chatMessage) => (
              <div
                key={chatMessage.id}
                className={`flex ${
                  chatMessage.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-5 ${
                    chatMessage.sender === "user"
                      ? "rounded-br-md bg-emerald-600 text-white"
                      : "rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm"
                  }`}
                >
                  {chatMessage.message}
                </div>
              </div>
            ))}
          </div>

          {/* Message input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-slate-200 bg-white p-4"
          >
            <div className="flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 p-1.5 pl-4 transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Type your message..."
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />

              <button
                type="submit"
                disabled={!input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Floating chat button */}
      {!isOpen && (
        <button
          type="button"
          onClick={openChat}
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-300 transition hover:-translate-y-1 hover:scale-105"
          aria-label="Open live chat"
        >
          <MessageCircle className="h-7 w-7" />

          <span className="absolute right-0 top-0 h-4 w-4 rounded-full border-2 border-white bg-red-500" />
        </button>
      )}
    </div>
  );
}
