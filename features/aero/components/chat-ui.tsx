"use client";

import { useState, useRef, useEffect } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const aiResponse = await aeroChatService.sendMessage(newMessages);
      setMessages([...newMessages, { role: "assistant", content: aiResponse }]);
    } catch (error: any) {
      console.error("Aero AI Error:", error);
      toast.error(
        error.message || "Something went wrong. Please check your API key.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-12rem)] w-full max-w-4xl mx-auto shadow-2xl border-none bg-white/50 backdrop-blur-xl dark:bg-zinc-950/50">
      <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-br from-zinc-900 to-zinc-600 dark:from-zinc-50 dark:to-zinc-400 bg-clip-text text-transparent">
              Aero AI Assistant
            </CardTitle>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Powered by Aerophantom
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
        ref={scrollRef}
      >
        {messages.length === 0 && (
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
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-none"
                  : "bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-tl-none text-zinc-800 dark:text-zinc-200",
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex w-full items-start gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-primary/10 border-primary/20 text-primary">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0 border-t border-zinc-100 dark:border-zinc-800 mt-4">
        <form
          className="flex w-full items-center gap-2 pt-6"
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
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105"
            disabled={isLoading || !input.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
