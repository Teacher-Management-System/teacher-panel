"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, User, Bot, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import aeroChatService, { Message } from "../chat.service";
import { toast } from "sonner";

export default function AeroChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const parseTimestamp = useCallback((date: any) => {
    if (!date) return Date.now();
    if (typeof date === "number") return date * 1000;
    // Handle SQL style dates: replace dash with slash for better browser support
    const timeStr = typeof date === "string" ? date.replace(/-/g, "/") : date;
    const parsed = Date.parse(timeStr);
    return isNaN(parsed) ? Date.now() : parsed;
  }, []);

  const mapMessage = useCallback(
    (m: any): Message => ({
      role: m.role,
      content: m.content,
      timestamp: parseTimestamp(m.created_at),
      tokens: m.tokens,
    }),
    [parseTimestamp],
  );

  const fetchMessages = useCallback(async () => {
    try {
      const resp = await aeroChatService.getMessages();

      // Multi-layer unwrap to handle various backend responses
      let data = resp;
      if (data?.data && !Array.isArray(data) && !data.role) {
        data = data.data;
      }

      let newMessagesList: Message[] = [];

      // 1. Check if data itself is an array
      if (Array.isArray(data)) {
        newMessagesList = data.map(mapMessage);
      }
      // 2. Check for common keys containing arrays
      else if (data?.messages && Array.isArray(data.messages)) {
        newMessagesList = data.messages.map(mapMessage);
      } else if (data?.message && Array.isArray(data.message)) {
        newMessagesList = data.message.map(mapMessage);
      } else if (data?.data && Array.isArray(data.data)) {
        newMessagesList = data.data.map(mapMessage);
      }
      // 3. Check for single message keys
      else if (data?.role) {
        newMessagesList = [mapMessage(data)];
      } else if (
        data?.message ||
        data?.user_message ||
        data?.assistant_message
      ) {
        if (data.user_message)
          newMessagesList.push(mapMessage(data.user_message));
        if (data.assistant_message)
          newMessagesList.push(mapMessage(data.assistant_message));
        if (data.message && !Array.isArray(data.message))
          newMessagesList.push(mapMessage(data.message));
      }

      if (newMessagesList.length > 0) {
        setMessages(newMessagesList);
        return newMessagesList;
      } else {
        console.warn("Aero AI: No messages found in response", resp);
        return [];
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      return [];
    }
  }, [mapMessage]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isPolling]);

  useEffect(() => {
    if (!isPolling) return;

    const interval = setInterval(async () => {
      try {
        const latestMessages = await fetchMessages();
        const lastMsg = latestMessages[latestMessages.length - 1];

        if (lastMsg?.role === "assistant") {
          setIsPolling(false);
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPolling, fetchMessages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await aeroChatService.sendMessage(userMessage.content);

      if (response?.user_message?.conversation_id) {
        setConversationId(response.user_message.conversation_id);
      }

      // If the response already contains the assistant message, we don't need to poll
      if (response?.assistant_message) {
        setIsPolling(false);
        await fetchMessages();
      } else {
        setIsPolling(true);
      }
    } catch (error: any) {
      console.error("Aero AI Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Logic: Show loading if we are explicitly loading/polling,
  // or if the last message is from user (waiting for AI)
  const lastMessage = messages[messages.length - 1];
  const isWaitingForAi = messages.length > 0 && lastMessage.role === "user";
  const showLoading = isLoading || isPolling || isWaitingForAi;

  return (
    <Card className="flex flex-col h-[calc(100vh-8rem)] w-full shadow-none border-none bg-transparent">
      <CardContent
        className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar"
        ref={scrollRef}
      >
        {messages.length === 0 && !showLoading && (
          <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-50">
            <div className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-400">
              <Sparkles className="w-12 h-12" />
            </div>
            <p className="text-sm font-medium">
              Hello! I'm Aero. How can I help you today?
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex w-full items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
              msg.role === "user" ? "flex-row-reverse" : "flex-row",
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                msg.role === "user"
                  ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                  : "bg-primary/10 border-primary/20 text-primary",
              )}
            >
              {msg.role === "user" ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>

            <div
              className={cn(
                "flex flex-col gap-1",
                msg.role === "user" ? "items-end" : "items-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-tl-none text-zinc-800 dark:text-zinc-200",
                )}
              >
                {msg.content}
              </div>
              <div
                className={cn(
                  "flex items-center gap-2 px-1 text-[10px] text-zinc-400 font-medium",
                  msg.role === "user"
                    ? "flex-row-reverse text-right"
                    : "flex-row text-left",
                )}
              >
                <span>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {msg.tokens != null && (
                  <>
                    <div className="w-1 h-1 rounded-full bg-zinc-300" />
                    <span>{msg.tokens} tokens</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {showLoading && (
          <div className="flex w-full items-start gap-3 animate-in fade-in duration-500">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-primary/10 border-primary/20 text-primary">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-0 border-none mt-auto">
        <form
          className="flex w-full items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <Input
            placeholder="Ask Aero anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 h-12 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary rounded-xl"
            disabled={isLoading || isPolling}
          />
          <Button
            type="submit"
            size="icon"
            className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105"
            disabled={isLoading || isPolling || !input.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
