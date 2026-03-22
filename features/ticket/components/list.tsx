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

interface Message {
  id: string;
  text: string;
  sender: string;
  time: string;
  isAdmin: boolean;
}

interface Ticket {
  id: string;
  subject: string;
  lastMessage: string;
  status: "pending" | "open" | "closed";
  user: string;
  date: string;
  ticketId: string;
  messages: Message[];
}

function TicketListContent() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const searchParams = useSearchParams();
  const ticketIdParam = searchParams.get("ticketId");

  const [activeTab, setActiveTab] = useState<Ticket["status"]>("open");
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ pending: 0, open: 0, closed: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollHeightRef = useRef<number>(0);
  const isInitialLoad = useRef<boolean>(true);

  // Auto-select ticket from URL parameter
  useEffect(() => {
    const autoSelectTicket = async () => {
      if (ticketIdParam && !activeTicket) {
        // First look in current list
        let ticket = tickets.find((t) => t.id === ticketIdParam);

        if (ticket) {
          // If ticket was fetched and not in current list, add it to the list
          if (!tickets.find((t) => t.id === ticket.id)) {
            setTickets((prev) => [ticket, ...prev]);
          }
          setActiveTicket(ticket);
        }
      }
    };
    autoSelectTicket();
  }, [ticketIdParam, tickets, !!activeTicket]);

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
  }, []);

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
            if (mappedTickets.length > 0) {
              setActiveTicket(mappedTickets[0]);
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
  }, [activeTab]);

  const [messagesLoading, setMessagesLoading] = useState(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeTicket?.messages.length, activeTicket?.id]);

  // Fetch messages when a ticket is selected
  useEffect(() => {
    isInitialLoad.current = true;
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

          if (total > 1 && isInitialLoad.current) {
            response = await ticketService.getMessages(activeTicket.id, total);
          }

          if (response && response.messages) {
            const mappedMessages: Message[] = response.messages.map(
              (m: any) => ({
                id: m.id,
                text: m.body,
                sender: m.sender?.name || "Unknown",
                time: new Date(m.createdAt * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                isAdmin:
                  m.isAdmin !== undefined
                    ? m.isAdmin
                    : m.sender?.name !== activeTicket.user,
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

    if (isInitialLoad.current) {
      fetchMessages();
    }
  }, [activeTicket?.id]);

  // Handle Scroll for Infinite Scroll (Load Older)
  const handleScroll = async () => {
    if (
      !scrollRef.current ||
      !activeTicket ||
      isFetchingMore ||
      currentPage <= 1
    )
      return;

    const { scrollTop, scrollHeight } = scrollRef.current;

    // When scrolling to the top, load previous page
    if (scrollTop === 0) {
      try {
        setIsFetchingMore(true);
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
            time: new Date(m.createdAt * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isAdmin:
              m.isAdmin !== undefined
                ? m.isAdmin
                : m.sender?.name !== activeTicket.user,
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

        // Use the first valid message found in any of the events
        const messageData = data.message || data;
        if (messageData && (messageData.body || messageData.text)) {
          const m = messageData;
          setActiveTicket((prev) => {
            if (!prev) return null;
            const exists = prev.messages.some((msg) => msg.id === m.id);
            if (exists) return prev;

            const newMessage: Message = {
              id: m.id || Math.random().toString(36).substr(2, 9),
              text: m.body || m.text,
              sender: m.sender?.name || (m.isAdmin ? "Support" : prev.user),
              time: m.createdAt
                ? new Date(m.createdAt * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Just now",
              isAdmin:
                m.isAdmin !== undefined
                  ? m.isAdmin
                  : m.sender?.name !== prev.user,
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
      await ticketService.createTicket(data.subject, data.message);
      toast.success("Ticket created successfully");

      // Refresh list and stats
      const [ticketsResponse, statsResponse]: any = await Promise.all([
        ticketService.getTickets(activeTab),
        ticketService.getTickets(),
      ]);

      if (ticketsResponse && ticketsResponse.tickets) {
        setTickets(
          ticketsResponse.tickets.map((t: ApiTicket) => ({
            id: t.id,
            subject: t.subject,
            lastMessage: t.description,
            status: t.status,
            user: t.user?.name || "Unknown",
            date: new Date(t.createdAt * 1000).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            ticketId: `T-${t.ticket_number}`,
            messages: [], // Will be fetched when selected
          })),
        );
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
      await ticketService.sendMessage(activeTicket.id, messageInput.trim());

      const newMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        text: messageInput.trim(),
        sender: user?.name || "User",
        time: "Just now",
        isAdmin: false,
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
    <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] bg-[#f8fafc]/60 md:p-6 space-y-6">
      {/* Header Section */}
      <Card className="rounded-[20px] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
        <CardContent className="p-1 md:px-6 md:py-1 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative p-4 bg-gradient-to-br from-primary to-primary/80 rounded-[22px] shadow-lg shadow-primary/20">
                <Ticket className="h-7 w-7 text-white" />
                <div className="absolute -bottom-1 -right-1 p-1 bg-primary rounded-lg border-2 border-white">
                  <Plus className="h-2.5 w-2.5 text-white stroke-[3]" />
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                Support Center
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                <p className="text-slate-400 text-[13px] font-medium leading-none">
                  Resolution hub for all student inquiries
                </p>
                <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center bg-slate-50/80 rounded-2xl p-1.5 px-4 shadow-sm">
              <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
                <div className="h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]" />
                <span className="text-[12px] font-bold text-slate-600 whitespace-nowrap">
                  {loading ? "..." : stats.pending} Pending
                </span>
              </div>
              <div className="flex items-center gap-2 pl-4">
                <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(31,192,199,0.5)]" />
                <span className="text-[12px] font-bold text-slate-600 whitespace-nowrap">
                  {loading ? "..." : stats.open} Open
                </span>
              </div>
            </div>
            <AddTicketDialog onAddTicket={addTicket} />
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        {/* Left Sidebar - Ticket List */}
        <div className="w-full md:w-[360px] flex flex-col gap-4">
          <div className="bg-white rounded-[28px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 flex flex-col gap-5">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search by ID or Subject..."
                className="pl-11 bg-slate-50 border-transparent h-12 rounded-2xl focus-visible:ring-primary/10 focus-visible:bg-white transition-all text-[15px] font-medium placeholder:text-slate-300 shadow-inner"
              />
            </div>

            <div className="flex p-1.5 bg-slate-50/80 rounded-2xl border border-slate-100/50">
              {(["pending", "open", "closed"] as const).map((tab) => (
                <Button
                  key={tab}
                  variant="ghost"
                  size="sm"
                  className={`flex-1 h-10 text-[11px] font-black uppercase tracking-wider transition-all duration-300 rounded-xl flex items-center justify-center gap-1.5 ${
                    activeTab === tab
                      ? "bg-white text-primary shadow-md shadow-primary/10 border border-slate-100"
                      : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {stats[tab] > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                        activeTab === tab
                          ? "bg-primary/5 text-primary"
                          : "bg-slate-200/50 text-slate-400"
                      }`}
                    >
                      {stats[tab]}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex-1 -mx-2 px-2 overflow-y-auto custom-scrollbar">
            {listLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4 pb-4">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => setActiveTicket(ticket)}
                    className={`p-5 rounded-[28px] cursor-pointer transition-all duration-300 border shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] relative group ${
                      activeTicket?.id === ticket.id
                        ? "bg-white border-primary/20 shadow-primary/5 scale-[1.02] z-10"
                        : "bg-white border-slate-100 hover:border-primary/20 hover:shadow-primary/5 hover:translate-x-1"
                    }`}
                  >
                    {activeTicket?.id === ticket.id && (
                      <div className="absolute left-0 top-6 bottom-6 w-1 bg-primary rounded-r-full" />
                    )}
                    <div className="flex justify-between items-start mb-1.5 pl-2">
                      <h4
                        className={`font-bold text-[15px] leading-tight transition-colors ${
                          activeTicket?.id === ticket.id
                            ? "text-primary"
                            : "text-slate-800"
                        }`}
                      >
                        {ticket.subject}
                      </h4>
                      <Badge
                        className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-md border-transparent ${
                          ticket.status === "pending"
                            ? "bg-orange-50 text-orange-600"
                            : ticket.status === "open"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {ticket.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 font-bold mb-3 pl-2 tracking-wide uppercase opacity-70">
                      {ticket.ticketId}
                    </p>
                    <p className="text-[13px] text-slate-500 line-clamp-2 mb-4 pl-2 leading-relaxed font-medium">
                      {stripHtml(ticket.lastMessage)}
                    </p>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-50 pl-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                          <span className="text-[10px] font-black text-slate-400 uppercase">
                            {ticket.user.charAt(0)}
                          </span>
                        </div>
                        <span className="text-[12px] font-bold text-slate-700">
                          {ticket.user}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-medium">
                          {ticket.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Area - Conversation */}
        {listLoading || messagesLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-[20px] border border-slate-100 shadow-sm p-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-slate-400 font-medium">
              Loading messages...
            </p>
          </div>
        ) : activeTicket ? (
          <div className="flex-1 flex flex-col min-h-0 bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 overflow-hidden">
            {/* Conversation Header */}
            <div className="p-6 md:p-8 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-md">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">
                      {activeTicket.subject}
                    </h3>
                    <div className="flex items-center gap-4 mt-1.5 px-0.5">
                      <div className="flex items-center gap-1.5">
                        <UserIcon className="w-3.5 h-3.5 text-primary/60" />
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                          {activeTicket.user}
                        </span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-slate-200" />
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary/60" />
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">
                          CREATED {activeTicket.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {activeTicket.status === "closed" && (
                  <Button
                    onClick={() => updateTicketStatus(activeTicket.id, "open")}
                    variant="outline"
                    className="rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-black text-[11px] uppercase tracking-wider px-5 h-10 shadow-sm transition-all active:scale-95"
                  >
                    Reopen Ticket
                  </Button>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex-1 p-6 md:p-10 bg-[#fcfdfe] overflow-y-auto custom-scrollbar"
            >
              <div className="space-y-10 max-w-4xl mx-auto">
                {isFetchingMore && (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  </div>
                )}
                {/* Messages */}
                {activeTicket.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-5 ${message.isAdmin ? "flex-row" : "flex-row-reverse"}`}
                  >
                    <div className="flex-shrink-0 relative">
                      <div
                        className={`w-11 h-11 rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden ${
                          message.isAdmin ? "bg-slate-900" : "bg-primary"
                        }`}
                      >
                        <span className="text-xs font-black text-white uppercase">
                          {message.sender.charAt(0)}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`flex flex-col max-w-[80%] ${message.isAdmin ? "items-start" : "items-end"}`}
                    >
                      <div
                        className={`flex items-center gap-3 mb-2 px-1 ${message.isAdmin ? "flex-row" : "flex-row-reverse"}`}
                      >
                        <span className="text-[14px] font-black text-slate-800">
                          {message.sender}
                        </span>
                        <span
                          className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md ${
                            message.isAdmin
                              ? "bg-blue-50 text-blue-600"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {message.isAdmin ? "SUPPORT AGENT" : "CUSTOMER"}
                        </span>
                        <span className="text-[10px] font-bold text-slate-300 uppercase">
                          {message.time}
                        </span>
                      </div>
                      <div
                        className={`px-5 py-3 rounded-[10px] shadow-sm text-[15px] font-medium leading-relaxed ${
                          message.isAdmin
                            ? "bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-slate-200/20"
                            : "bg-primary text-white rounded-tr-none shadow-primary/20"
                        }`}
                        dangerouslySetInnerHTML={{ __html: message.text }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Controls removed and shifted to handleScroll */}

            {/* Reply Area */}
            <div className="p-4 md:p-6 bg-white border-t border-slate-50">
              <div className="max-w-4xl mx-auto">
                {activeTicket.status === "pending" ? (
                  <div className="py-6 px-8 bg-orange-50/50 rounded-2xl border border-dashed border-orange-200 text-center">
                    <p className="text-[13px] font-black text-orange-600 uppercase tracking-widest">
                      Admin approve the ticket after open the ticket
                    </p>
                  </div>
                ) : activeTicket.status === "closed" ? (
                  <div className="py-6 px-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                    <p className="text-[13px] font-black text-slate-400 uppercase tracking-widest">
                      Ticket Closed
                    </p>
                  </div>
                ) : (
                  <div className="relative bg-slate-50 rounded-[22px] p-1.5 pr-4 border border-slate-100 focus-within:bg-white focus-within:shadow-primary/10 focus-within:border-primary/20 transition-all group">
                    <Textarea
                      placeholder="Write your response here..."
                      className="w-full min-h-[44px] max-h-[160px] py-2.5 pl-4 pr-12 bg-transparent border-none focus-visible:ring-0 resize-none text-[15px] font-medium placeholder:text-slate-300 transition-all"
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
          <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-[20px] border border-slate-100 shadow-sm gap-6 p-10 text-center">
            <div className="w-24 h-24 rounded-[20px] bg-primary/5 flex items-center justify-center shadow-inner">
              <MessageSquare className="h-10 w-10 text-primary/40 opacity-60" />
            </div>
            <div className="max-w-[280px]">
              <h3 className="text-xl font-black text-slate-800 mb-2">
                Select a Conversation
              </h3>
              <p className="text-[13px] font-medium text-slate-400 leading-relaxed">
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
