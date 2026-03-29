"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Plus,
  Clock,
  MessageSquare,
  Send,
  User as UserIcon,
  Ticket,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { AddTicketDialog } from "./add-ticket-dialog";
import { useAuth } from "@/hooks/useAuth";

import { toast } from "sonner";
import { ticketService } from "../api.service";
import { Ticket as ApiTicket } from "../model";
import { getEcho } from "@/lib/echo";
import { stripHtml } from "@/lib/utils";
import { useQueryState, parseAsString } from "nuqs";

interface Message {
  id: string;
  text: string;
  sender: string;
  senderId: string;
  time: string;
  isAdmin: boolean;
}

interface Ticket {
  id: string;
  subject: string;
  lastMessage: string;
  status: "pending" | "open" | "closed";
  user: string;
  userId: string;
  date: string;
  ticketId: string;
  messages: Message[];
}

function TicketListContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useQueryState("status", {
    defaultValue: "open",
    parse: (value) =>
      ["pending", "open", "closed"].includes(value)
        ? (value as Ticket["status"])
        : "open",
  });
  const [ticketId, setTicketId] = useQueryState("ticketId", parseAsString);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ pending: 0, open: 0, closed: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollHeightRef = useRef<number>(0);
  const isInitialLoad = useRef<boolean>(true);
  const shouldScrollToBottomRef = useRef<boolean>(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Auto-select ticket from URL parameter (ticketId)
  useEffect(() => {
    if (ticketId) {
      const ticket = tickets.find((t) => t.id === ticketId);
      if (ticket) {
        setActiveTicket(ticket);
      }
    } else {
      setActiveTicket(null);
    }
  }, [ticketId, tickets]);

  // Fetch initial stats once
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response: any = await ticketService.getTickets();
        if (response && response.tickets) {
          const allTickets: ApiTicket[] = response.tickets;
          setStats({
            pending: allTickets.filter((t) => t.status === "pending").length,
            open: allTickets.filter((t) => t.status === "open").length,
            closed: allTickets.filter((t) => t.status === "closed").length,
          });
        }
      } catch (error) {
        console.error("Failed to fetch ticket stats:", error);
      }
    };
    fetchStats();
  }, [refreshTrigger]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setListLoading(true);
        const response: any = await ticketService.getTickets(activeTab);
        if (response && response.tickets) {
          const mappedTickets: Ticket[] = response.tickets.map(
            (t: ApiTicket) => ({
              id: t.id,
              subject: t.subject,
              lastMessage: t.description,
              status: t.status,
              user: t.user?.name || "Unknown",
              userId: t.user?.id || "",
              date: new Date(t.createdAt * 1000).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              ticketId: `T-${t.ticket_number}`,
              messages: [
                {
                  id: `m-${t.id}`,
                  text: t.description,
                  sender: t.user?.name || "User",
                  senderId: t.user?.id || "",
                  time: new Date(t.createdAt * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  isAdmin: false,
                },
              ],
            }),
          );
          setTickets(mappedTickets);

          if (
            !activeTicket ||
            !mappedTickets.some((t) => t.id === activeTicket.id)
          ) {
            if (ticketId) {
              const targetTicket = mappedTickets.find(
                (t) => t.id === ticketId,
              );
              if (targetTicket) setActiveTicket(targetTicket);
              else setActiveTicket(null);
            } else {
              setActiveTicket(null);
            }
          }
        } else {
          setTickets([]);
          setActiveTicket(null);
        }
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      } finally {
        setListLoading(false);
        setLoading(false);
      }
    };

    fetchTickets();
  }, [activeTab, refreshTrigger]);

  // Listen for ticket-updated custom events (from notification-listener.tsx)
  useEffect(() => {
    const handleTicketUpdate = (event: any) => {
      console.log("📥 RECEIVED ticket-updated event:", event.detail);
      setRefreshTrigger((prev) => prev + 1);
    };

    window.addEventListener("ticket-updated", handleTicketUpdate);
    return () =>
      window.removeEventListener("ticket-updated", handleTicketUpdate);
  }, []);

  const [messagesLoading, setMessagesLoading] = useState(false);

  // Auto-scroll to bottom when messages change or loading finishes
  useEffect(() => {
    if (
      !messagesLoading &&
      scrollRef.current &&
      shouldScrollToBottomRef.current
    ) {
      // Use a small timeout to ensure layout is done
      const timeout = setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [activeTicket?.messages.length, activeTicket?.id, messagesLoading]);

  // Fetch messages when a ticket is selected
  useEffect(() => {
    isInitialLoad.current = true;
    shouldScrollToBottomRef.current = true;
  }, [activeTicket?.id]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeTicket) return;
      try {
        setMessagesLoading(true);
        // Step 1: Fetch first page to get metadata (Total Pages)
        const firstPageResponse: any = await ticketService.getMessages(
          activeTicket.id,
          1,
        );
        if (firstPageResponse && firstPageResponse.meta) {
          const total = firstPageResponse.meta.total_page || 1;
          setTotalPages(total);

          // Step 2: If multiple pages, fetch the LAST page (latest messages)
          let targetPage = total;
          let response = firstPageResponse;

          if (total > 1) {
            response = await ticketService.getMessages(activeTicket.id, total);
          }

          if (response && response.messages) {
            const mappedMessages: Message[] = response.messages.map(
              (m: any) => ({
                id: m.id,
                text: m.body,
                sender: m.sender?.name || "Unknown",
                senderId: m.sender?.id || m.sender_id || "",
                time: new Date(m.createdAt * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                isAdmin:
                  m.isAdmin !== undefined
                    ? m.isAdmin
                    : m.sender?.name?.trim().toLowerCase() !==
                      activeTicket.user?.trim().toLowerCase(),
              }),
            );

            setCurrentPage(targetPage);
            setActiveTicket((prev) =>
              prev ? { ...prev, messages: mappedMessages } : null,
            );
            isInitialLoad.current = false;
          }
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setMessagesLoading(false);
      }
    };

    fetchMessages();
  }, [activeTicket?.id]);

  // Chain load: If content is too short to scroll, load more automatically
  useEffect(() => {
    const checkAndLoadMore = async () => {
      if (
        !messagesLoading &&
        !isFetchingMore &&
        scrollRef.current &&
        activeTicket &&
        currentPage > 1
      ) {
        const { scrollHeight, clientHeight } = scrollRef.current;
        // If content doesn't fill the container (or is very close), load more
        if (scrollHeight <= clientHeight + 50) {
          // Reuse the logic from handleScroll but as a direct call
          await handleScroll();
        }
      }
    };

    const timeout = setTimeout(checkAndLoadMore, 500);
    return () => clearTimeout(timeout);
  }, [
    activeTicket?.messages.length,
    messagesLoading,
    isFetchingMore,
    currentPage,
  ]);

  // Handle Scroll for Infinite Scroll (Load Older)
  const handleScroll = async () => {
    if (!scrollRef.current || !activeTicket || currentPage <= 1) return;

    const { scrollTop, scrollHeight } = scrollRef.current;

    // When scrolling near the top, load previous page
    if (scrollTop <= 5) {
      try {
        setIsFetchingMore(true);
        shouldScrollToBottomRef.current = false; // Disable auto-scroll for pagination
        scrollHeightRef.current = scrollHeight; // Store height before loading more

        const prevPage = currentPage - 1;
        const response: any = await ticketService.getMessages(
          activeTicket.id,
          prevPage,
        );

        if (response && response.messages) {
          const olderMessages: Message[] = response.messages.map((m: any) => ({
            id: m.id,
            text: m.body,
            sender: m.sender?.name || "Unknown",
            senderId: m.sender?.id || m.sender_id || "",
            time: new Date(m.createdAt * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isAdmin:
              m.isAdmin !== undefined
                ? m.isAdmin
                : m.sender?.name?.trim().toLowerCase() !==
                  activeTicket.user?.trim().toLowerCase(),
          }));

          setCurrentPage(prevPage);
          setActiveTicket((prev) =>
            prev
              ? { ...prev, messages: [...olderMessages, ...prev.messages] }
              : null,
          );

          // After state update, adjust scroll position to maintain view
          setTimeout(() => {
            if (scrollRef.current) {
              const newScrollHeight = scrollRef.current.scrollHeight;
              scrollRef.current.scrollTop =
                newScrollHeight - scrollHeightRef.current;
            }
          }, 0);
        }
      } catch (error) {
        console.error("Failed to load older messages:", error);
      } finally {
        setIsFetchingMore(false);
      }
    }
  };

  // Real-time listener for new messages
  useEffect(() => {
    const echo = getEcho();
    if (!echo || !activeTicket) return;

    const onStateChange = (state: any) => {
      if (state.current === "connected") {
        console.log("Connected to WebSocket ✅");
      }
    };

    if (echo.connector?.pusher?.connection) {
      echo.connector.pusher.connection.bind("state_change", onStateChange);
      if (echo.connector.pusher.connection.state === "connected") {
        console.log("Already Connected to WebSocket ✅");
      }
    }

    const channelName = `ticket.${activeTicket.id}`;
    const eventName = `TicketMessageSent`;
    const altEventName = `.TicketMessageSent`; // Trying with dot prefix (common in Laravel)

    console.log(`📡 Subscribing to PRIVATE channel: ${channelName}`);

    const channel = echo.private(channelName);

    // Listen for both variations
    [eventName, altEventName, "MessageSent"].forEach((evt) => {
      channel.listen(evt, (data: any) => {
        console.log(`🔥 REALTIME Received [${evt}]:`, data);
        shouldScrollToBottomRef.current = true;

        // Use the first valid message found in any of the events
        const messageData = data.message || data;
        if (messageData && (messageData.body || messageData.text)) {
          const m = messageData;
          setActiveTicket((prev) => {
            if (!prev) return null;

            const sender = m.message_sender || m.sender;
            const senderName =
              sender?.name || (m.isAdmin ? "Support" : prev.user);
            const senderId = sender?.id || m.sender_id || "";

            const isDuplicate = prev.messages.some(
              (msg) =>
                msg.id === m.id ||
                (msg.time === "Just now" && msg.text === (m.body || m.text)),
            );

            if (isDuplicate) {
              // If it's a duplicate, update the ID and role if needed
              if (m.id) {
                return {
                  ...prev,
                  messages: prev.messages.map((msg) =>
                    msg.time === "Just now" && msg.text === (m.body || m.text)
                      ? {
                          ...msg,
                          id: m.id,
                          senderId: senderId,
                          isAdmin:
                            senderName?.trim().toLowerCase() !==
                            prev.user?.trim().toLowerCase(),
                        }
                      : msg,
                  ),
                };
              }
              return prev;
            }

            const newMessage: Message = {
              id: m.id || Math.random().toString(36).substr(2, 9),
              text: m.body || m.text,
              sender: senderName,
              senderId: senderId,
              time: m.createdAt
                ? new Date(m.createdAt * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Just now",
              isAdmin:
                senderName?.trim().toLowerCase() !==
                prev.user?.trim().toLowerCase(),
            };

            return {
              ...prev,
              messages: [...prev.messages, newMessage],
            };
          });
        }
      });
    });

    console.log(`✅ Listeners attached for ${channelName}`);

    return () => {
      if (echo.connector?.pusher?.connection) {
        echo.connector.pusher.connection.unbind("state_change", onStateChange);
      }
      channel.stopListening(eventName);
      echo.leaveChannel(channelName);
    };
  }, [activeTicket?.id]);

  const filteredTickets = tickets; // API already filters by status
  const addTicket = async (data: { subject: string; message: string }) => {
    try {
      setLoading(true);
      const response: any = await ticketService.createTicket(
        data.subject,
        data.message,
      );
      toast.success("Ticket created successfully");

      // Switch to pending tab where the new ticket is
      await setActiveTab("pending");

      // Robust ID detection from response
      const newTicketId = response?.uuid || response?.id || response?.ticket?.id || response?.ticket?.uuid;

      if (newTicketId) {
        await setTicketId(newTicketId);
      }

      // Refresh list and stats
      const [ticketsResponse, statsResponse]: any = await Promise.all([
        ticketService.getTickets("pending"),
        ticketService.getTickets(),
      ]);

      if (ticketsResponse && ticketsResponse.tickets) {
        const mappedTickets = ticketsResponse.tickets.map((t: ApiTicket) => ({
          id: t.id,
          subject: t.subject,
          lastMessage: t.description,
          status: t.status,
          user: t.user?.name || "Unknown",
          userId: t.user?.id || "",
          date: new Date(t.createdAt * 1000).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          ticketId: `T-${t.ticket_number}`,
          messages: [],
        }));
        setTickets(mappedTickets);

        // Find and set active ticket immediately
        const ticketToOpen = newTicketId 
          ? mappedTickets.find((t: any) => t.id === newTicketId)
          : mappedTickets[0]; // Fallback to newest if ID not found

        if (ticketToOpen) {
          setActiveTicket(ticketToOpen);
          if (!newTicketId) await setTicketId(ticketToOpen.id);
        }
      }

      if (statsResponse && statsResponse.tickets) {
        const all: ApiTicket[] = statsResponse.tickets;
        setStats({
          pending: all.filter((t) => t.status === "pending").length,
          open: all.filter((t) => t.status === "open").length,
          closed: all.filter((t) => t.status === "closed").length,
        });
      }
    } catch (error) {
      toast.error("Failed to create ticket");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = (id: string, newStatus: Ticket["status"]) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)),
    );
    if (activeTicket?.id === id) {
      setActiveTicket({ ...activeTicket, status: newStatus });
    }
  };

  const [messageInput, setMessageInput] = useState("");

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeTicket || isSending) return;

    try {
      setIsSending(true);
      const response: any = await ticketService.sendMessage(
        activeTicket.id,
        messageInput.trim(),
      );
      shouldScrollToBottomRef.current = true;

      const newMessage: Message = {
        id: response?.message?.id || Math.random().toString(36).substr(2, 9),
        text: messageInput.trim(),
        sender: user?.name || "User",
        senderId: user?.id?.toString() || "",
        time: "Just now",
        isAdmin:
          user?.name?.trim().toLowerCase() !==
          activeTicket.user?.trim().toLowerCase(), // Match by name as fallback
      };

      const updatedTickets = tickets.map((t) =>
        t.id === activeTicket.id
          ? {
              ...t,
              messages: [...t.messages, newMessage],
              lastMessage: newMessage.text,
            }
          : t,
      );

      setTickets(updatedTickets);
      setActiveTicket({
        ...activeTicket,
        messages: [...activeTicket.messages, newMessage],
        lastMessage: newMessage.text,
      });
      setMessageInput("");
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-auto md:h-[calc(100vh-3rem)] bg-background md:p-6 space-y-4 md:space-y-6 md:overflow-hidden">
      {/* Header Section */}
      <Card className="rounded-[20px] border border-border shadow-sm bg-card overflow-hidden shrink-0">
        <CardContent className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
          <div className="flex items-center gap-3 md:gap-5 w-full md:w-auto">
            <div className="relative group shrink-0">
              <div className="absolute inset-0 bg-primary/20 blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative p-2.5 md:p-4 bg-gradient-to-br from-primary to-primary/80 rounded-[15px] md:rounded-[22px] shadow-lg shadow-primary/20">
                <Ticket className="h-4 w-4 md:h-7 md:w-7 text-white" />
                <div className="absolute -bottom-1 -right-1 p-0.5 md:p-1 bg-primary rounded-lg border-2 border-white">
                  <Plus className="h-2 w-2 md:h-2.5 md:w-2.5 text-white stroke-[3]" />
                </div>
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg md:text-3xl font-black text-foreground tracking-tight flex items-center gap-2 truncate">
                Support Center
              </h1>
              <p className="text-muted-foreground text-[10px] md:text-[13px] font-medium leading-none mt-1 truncate">
                Resolution hub for all teacher inquiries
              </p>
            </div>
          </div>

          <div className="flex flex-row md:flex-row items-center gap-2 md:gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex flex-1 md:flex-none items-center bg-muted/30 rounded-lg md:rounded-2xl p-1 md:p-2 px-2 md:px-6 border border-border h-10 md:h-14 overflow-hidden">
              <div className="flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-3 pr-2 md:pr-6 border-r border-border h-full">
                <div className="h-1.5 w-1.5 md:h-2.5 md:w-2.5 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)] shrink-0" />
                <span className="text-[9px] md:text-[14px] font-black text-muted-foreground whitespace-nowrap uppercase tracking-wider">
                  {loading ? ".." : stats.pending} <span className="hidden sm:inline ml-0.5 opacity-60">Pending</span>
                </span>
              </div>
              <div className="flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-3 pl-2 md:pl-6 h-full">
                <div className="h-1.5 w-1.5 md:h-2.5 md:w-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(31,192,199,0.5)] shrink-0" />
                <span className="text-[9px] md:text-[14px] font-black text-muted-foreground whitespace-nowrap uppercase tracking-wider">
                  {loading ? ".." : stats.open} <span className="hidden sm:inline ml-0.5 opacity-60">Open</span>
                </span>
              </div>
            </div>
            <div className="flex-1 md:flex-none">
              <AddTicketDialog onAddTicket={addTicket} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col md:flex-row gap-4 md:gap-6 min-h-0 md:overflow-hidden relative ${activeTicket ? 'h-[calc(100vh-10rem)] md:h-auto' : 'h-auto'}`}>
        {/* Left Sidebar - Ticket List */}
        <div className={`w-full md:w-[360px] flex-1 md:flex-none flex flex-col gap-4 transition-all duration-300 ${activeTicket ? 'hidden md:flex' : 'flex'}`}>
          <Card className="rounded-[20px] md:rounded-[28px] shadow-sm border border-border flex flex-col overflow-hidden">
            <CardContent className="p-4 md:p-6 flex flex-col gap-4 md:gap-5">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search by ID or Subject..."
                className="pl-11 bg-muted border-transparent h-12 rounded-2xl focus-visible:ring-primary/10 focus-visible:bg-muted/80 transition-all text-[15px] font-medium placeholder:text-muted-foreground/40"
              />
            </div>

            <div className="flex p-1.5 bg-muted/50 rounded-2xl border border-border relative z-20">
              {(["pending", "open", "closed"] as const).map((tab) => (
                <Button
                  key={tab}
                  variant="ghost"
                  size="sm"
                  className={`flex-1 h-10 text-[11px] font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 cursor-pointer select-none transition-colors ${
                    activeTab === tab
                      ? "bg-card text-primary shadow-sm border border-border"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                  }`}
                  onClick={() => {
                    setActiveTab(tab);
                  }}
                >
                  {tab}
                  {stats[tab] > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                        activeTab === tab
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {stats[tab]}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex-1 px-1 overflow-y-auto custom-scrollbar">
            {listLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4 pb-4">
                {filteredTickets.map((ticket) => (
                  <Card
                    key={ticket.id}
                    onClick={() => {
                      if (activeTicket?.id !== ticket.id) {
                        setMessagesLoading(true);
                        setActiveTicket(ticket);
                      }
                    }}
                    className={`rounded-[20px] md:rounded-[28px] cursor-pointer transition-all duration-300 border shadow-sm relative group overflow-hidden ${
                      activeTicket?.id === ticket.id
                        ? "bg-card border-primary/40 shadow-primary/5 scale-[1.02] z-10"
                        : "bg-card/40 border-border hover:border-primary/20 hover:shadow-primary/5 hover:translate-x-1"
                    }`}
                  >
                    <CardContent className="p-4 md:p-6 relative">
                      {activeTicket?.id === ticket.id && (
                        <div className="absolute left-0 top-6 bottom-6 w-1.5 bg-primary rounded-r-full shadow-[0_0_10px_rgba(31,192,199,0.3)]" />
                      )}
                      <div className="flex justify-between items-start mb-1.5 pl-2">
                        <h4
                          className={`font-bold text-[15px] leading-tight transition-colors ${
                            activeTicket?.id === ticket.id
                              ? "text-primary"
                              : "text-foreground"
                          }`}
                        >
                          {ticket.subject}
                        </h4>
                        <Badge
                          className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-md border-transparent ${
                            ticket.status === "pending"
                              ? "bg-orange-500/10 text-orange-500"
                              : ticket.status === "open"
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {ticket.status}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground/60 font-bold mb-3 pl-2 tracking-wide uppercase opacity-70">
                        {ticket.ticketId}
                      </p>
                      <p className="text-[13px] text-muted-foreground line-clamp-2 mb-4 pl-2 leading-relaxed font-medium">
                        {stripHtml(ticket.lastMessage)}
                      </p>

                      <div className="flex justify-between items-center pt-4 border-t border-border/30 pl-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-muted border border-border shadow-sm flex items-center justify-center overflow-hidden">
                          <span className="text-[10px] font-black text-muted-foreground/60 uppercase">
                            {ticket.user.charAt(0)}
                          </span>
                        </div>
                        <span className="text-[12px] font-bold text-foreground">
                          {ticket.user}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground/60">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-medium">
                          {ticket.date}
                        </span>
                      </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Area - Conversation */}
        {listLoading || messagesLoading ? (
          <div className={`flex-1 flex flex-col items-center justify-center bg-card md:rounded-[20px] border border-border shadow-sm p-10 ${!activeTicket ? 'hidden md:flex' : 'flex fixed inset-0 z-[100] md:relative md:z-auto'}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground font-medium">
              Loading messages...
            </p>
          </div>
        ) : activeTicket ? (
          <div className="flex-1 flex flex-col min-h-0 bg-card md:rounded-[20px] shadow-sm border border-border overflow-hidden fixed inset-0 md:relative z-[100] md:z-auto">
            {/* Conversation Header */}
            <div className="p-3 md:p-8 border-b border-border/50 flex justify-between items-center bg-card/50 backdrop-blur-md">
              <div className="flex items-center gap-2 md:gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden h-8 w-8 bg-muted rounded-lg border border-border"
                  onClick={() => {
                    setActiveTicket(null);
                    setTicketId(null);
                  }}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex flex-col gap-0.5 md:gap-2">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-1.5 md:p-2.5 bg-muted rounded-lg md:xl border border-border hidden sm:flex">
                      <MessageSquare className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-base md:text-xl font-black text-foreground tracking-tight line-clamp-1">
                        {activeTicket.subject}
                      </h3>
                      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mt-0.5 md:mt-1 px-0.5">
                        <div className="flex items-center gap-1.5">
                          <UserIcon className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary/60" />
                          <span className="text-[9px] md:text-[11px] font-black text-muted-foreground/60 uppercase tracking-wider">
                            {activeTicket.user}
                          </span>
                        </div>
                        <div className="hidden md:block w-1 h-1 rounded-full bg-border" />
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary/60" />
                          <span className="text-[9px] md:text-[11px] font-black text-muted-foreground/60 uppercase tracking-widest leading-none">
                            CREATED {activeTicket.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4"></div>
            </div>

            {/* Messages Area */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex-1 p-3 md:p-10 bg-background/20 overflow-y-auto custom-scrollbar min-h-0"
            >
              <div className="space-y-6 md:space-y-10 max-w-4xl mx-auto">
                {isFetchingMore && (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  </div>
                )}
                {/* Messages */}
                {activeTicket.messages.map((message) => {
                  const isMe =
                    message.senderId === user?.id?.toString() ||
                    message.sender === user?.name;
                  return (
                    <div
                      key={message.id}
                      className={`flex gap-2 md:gap-5 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div className="flex-shrink-0 relative">
                        <div
                          className={`w-8 h-8 md:w-11 md:h-11 rounded-full border-2 md:border-4 border-card shadow-md flex items-center justify-center overflow-hidden ${
                            isMe
                              ? "bg-primary"
                              : message.isAdmin
                                ? "bg-muted"
                                : "bg-muted/60"
                          }`}
                        >
                          <span className="text-[10px] md:text-xs font-black text-white uppercase">
                            {message.sender.charAt(0)}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`flex flex-col max-w-[85%] md:max-w-[80%] ${isMe ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`flex items-center gap-2 md:gap-3 mb-1 md:mb-2 px-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                        >
                          <span className="text-[12px] md:text-[14px] font-black text-foreground truncate max-w-[100px] md:max-w-none">
                            {message.sender}
                          </span>
                          <span
                            className={`text-[7px] md:text-[8px] font-black uppercase tracking-tight md:tracking-widest px-1 md:px-1.5 py-0.5 rounded-md ${
                              message.isAdmin
                                ? "bg-indigo-500/10 text-indigo-400"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            {message.isAdmin ? "AGENT" : "TEACHER"}
                          </span>
                          <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground/40 uppercase">
                            {message.time}
                          </span>
                        </div>
                        <div
                          className={`px-4 py-2 md:px-5 md:py-3 rounded-xl md:rounded-[22px] shadow-sm text-[14px] md:text-[15px] font-medium leading-relaxed ${
                            isMe
                              ? `bg-primary text-primary-foreground rounded-tr-none shadow-primary/20`
                              : `bg-card text-foreground border border-border rounded-tl-none shadow-sm`
                          }`}
                          dangerouslySetInnerHTML={{ __html: message.text }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination Controls removed and shifted to handleScroll */}

            {/* Reply Area */}
            <div className="p-4 md:p-6 bg-card border-t border-border/50">
              <div className="max-w-4xl mx-auto">
                {activeTicket.status === "pending" ? (
                  <div className="py-6 px-8 bg-orange-500/5 rounded-2xl border border-dashed border-orange-500/20 text-center">
                    <p className="text-[13px] font-black text-orange-500 uppercase tracking-widest">
                      Admin approve the ticket after open the ticket
                    </p>
                  </div>
                ) : activeTicket.status === "closed" ? (
                  <div className="py-6 px-8 bg-muted rounded-2xl border border-dashed border-border text-center">
                    <p className="text-[13px] font-black text-muted-foreground uppercase tracking-widest">
                      Ticket Closed
                    </p>
                  </div>
                ) : (
                  <div className="relative bg-muted rounded-[22px] p-1.5 pr-4 border border-border focus-within:bg-card focus-within:shadow-primary/10 focus-within:border-primary/20 transition-all group">
                    <Textarea
                      placeholder="Write your response here..."
                      className="w-full min-h-[44px] max-h-[160px] py-2.5 pl-4 pr-12 bg-transparent border-none focus-visible:ring-0 resize-none text-[15px] font-medium placeholder:text-muted-foreground/40 transition-all"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <div className="absolute right-3 bottom-3">
                      <Button
                        size="icon"
                        disabled={isSending}
                        className="rounded-xl bg-primary hover:bg-primary/90 text-white h-9 w-9 shadow-lg shadow-primary/20 transition-transform active:scale-90"
                        onClick={handleSendMessage}
                      >
                        {isSending ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Send className="h-4 w-4 rotate-[15deg]" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-card rounded-[20px] border border-border shadow-sm gap-6 p-10 text-center hidden md:flex">
            <div className="w-24 h-24 rounded-[20px] bg-primary/5 flex items-center justify-center shadow-inner">
              <MessageSquare className="h-10 w-10 text-primary/40 opacity-60" />
            </div>
            <div className="max-w-[280px]">
              <h3 className="text-xl font-black text-foreground mb-2">
                Select a Conversation
              </h3>
              <p className="text-[13px] font-medium text-muted-foreground leading-relaxed">
                Choose a ticket from the sidebar to view the full resolution
                history and respond.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function TicketList() {
  return (
    <Suspense fallback={<div>Loading tickets...</div>}>
      <TicketListContent />
    </Suspense>
  );
}
