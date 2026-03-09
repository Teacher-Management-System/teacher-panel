"use client";

import React, { useState, useEffect } from "react";
import {
  Headset,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  MessageSquare,
  MoreVertical,
  Send,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { AddTicketDialog } from "./add-ticket-dialog";
import { useAuth } from "@/hooks/useAuth";

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
  status: "open" | "in-progress" | "closed";
  user: string;
  date: string;
  ticketId: string;
  messages: Message[];
}

const INITIAL_TICKETS: Ticket[] = [
  {
    id: "1",
    subject: "Login Issue",
    lastMessage: "I cannot login to my account",
    status: "open",
    user: "Yash",
    date: "Feb 23, 2026",
    ticketId: "T-1000001",
    messages: [
      {
        id: "m1",
        text: "I cannot login to my account",
        sender: "Yash",
        time: "5 days ago",
        isAdmin: false,
      },
    ],
  },
  {
    id: "2",
    subject: "Payment Failure",
    lastMessage: "Transaction failed but money deducted",
    status: "in-progress",
    user: "Amit",
    date: "Feb 24, 2026",
    ticketId: "T-1000002",
    messages: [
      {
        id: "m2",
        text: "Transaction failed but money deducted",
        sender: "Amit",
        time: "4 days ago",
        isAdmin: false,
      },
      {
        id: "m3",
        text: "We are looking into this issue.",
        sender: "Admin",
        time: "3 days ago",
        isAdmin: true,
      },
    ],
  },
  {
    id: "3",
    subject: "Test Subject",
    lastMessage: "This is a test message",
    status: "closed",
    user: "Rahul",
    date: "Feb 25, 2026",
    ticketId: "T-1000003",
    messages: [
      {
        id: "m4",
        text: "This is a test message",
        sender: "Rahul",
        time: "2 days ago",
        isAdmin: false,
      },
    ],
  },
];

export function TicketList() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [activeTab, setActiveTab] = useState<Ticket["status"]>("in-progress");
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(
    INITIAL_TICKETS.find((t) => t.status === "in-progress") || null,
  );

  const filteredTickets = tickets.filter(
    (ticket) => ticket.status === activeTab,
  );

  const stats = {
    open: tickets.filter((t) => t.status === "open").length,
    "in-progress": tickets.filter((t) => t.status === "in-progress").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  };

  const addTicket = (data: { subject: string; message: string }) => {
    const newTicket: Ticket = {
      id: Math.random().toString(36).substr(2, 9),
      subject: data.subject,
      lastMessage: data.message,
      status: "open",
      user: user?.name || "User",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      ticketId: `T-${Math.floor(1000000 + Math.random() * 9000000)}`,
      messages: [
        {
          id: Math.random().toString(36).substr(2, 9),
          text: data.message,
          sender: user?.name || "User",
          time: "Just now",
          isAdmin: false,
        },
      ],
    };
    setTickets([newTicket, ...tickets]);
    setActiveTab("open");
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

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeTicket) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      text: messageInput.trim(),
      sender: user?.name || "Admin",
      time: "Just now",
      isAdmin: true,
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
  };

  useEffect(() => {
    // Only auto-select if the current active ticket is NO LONGER in the filtered list
    // (e.g. when changing tabs, or when the ticket status itself changed)
    const isStillVisible = filteredTickets.some(
      (t) => t.id === activeTicket?.id,
    );

    if (!isStillVisible) {
      if (filteredTickets.length > 0) {
        setActiveTicket(filteredTickets[0]);
      } else {
        setActiveTicket(null);
      }
    }
  }, [activeTab, filteredTickets, activeTicket?.id]);

  return (
    <div className="flex flex-col h-full bg-slate-50/30 md:p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
            <Headset className="h-6 w-6 text-slate-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">
              Customer Support
            </h1>
            <p className="text-slate-500 text-sm">
              Manage and respond to customer support tickets
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-white px-3 py-1.5 border-slate-200"
          >
            <MessageSquare className="h-3.5 w-3.5 mr-2 text-emerald-500" />
            {stats.open} Open
          </Badge>
          <Badge
            variant="outline"
            className="bg-white px-3 py-1.5 border-slate-200"
          >
            <Clock className="h-3.5 w-3.5 mr-2 text-amber-500" />
            {stats["in-progress"]} In Progress
          </Badge>
          <AddTicketDialog onAddTicket={addTicket} />
        </div>
      </div>

      {/* Main Content Area */}
      <Card className="flex-1 overflow-hidden border-slate-200 shadow-sm rounded-2xl bg-white border">
        <CardContent className="p-0 flex h-[calc(100vh-280px)]">
          {/* Left Sidebar - Ticket List */}
          <div className="w-full md:w-80 border-r border-slate-100 flex flex-col">
            <div className="p-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search tickets..."
                  className="pl-9 bg-slate-50 border-none h-10"
                />
              </div>

              <div className="flex p-1 bg-slate-50 rounded-lg">
                <Button
                  variant={activeTab === "open" ? "secondary" : "ghost"}
                  size="sm"
                  className={`flex-1 h-8 text-xs font-medium ${activeTab === "open" ? "bg-white shadow-sm border border-slate-100" : ""}`}
                  onClick={() => setActiveTab("open")}
                >
                  Open{" "}
                  {stats.open > 0 && (
                    <span className="ml-1 opacity-60">{stats.open}</span>
                  )}
                </Button>
                <Button
                  variant={activeTab === "in-progress" ? "secondary" : "ghost"}
                  size="sm"
                  className={`flex-1 h-8 text-xs font-medium ${activeTab === "in-progress" ? "bg-white shadow-sm border border-slate-100" : ""}`}
                  onClick={() => setActiveTab("in-progress")}
                >
                  In Progress{" "}
                  {stats["in-progress"] > 0 && (
                    <span className="ml-1 opacity-60">
                      {stats["in-progress"]}
                    </span>
                  )}
                </Button>
                <Button
                  variant={activeTab === "closed" ? "secondary" : "ghost"}
                  size="sm"
                  className={`flex-1 h-8 text-xs font-medium ${activeTab === "closed" ? "bg-white shadow-sm border border-slate-100" : ""}`}
                  onClick={() => setActiveTab("closed")}
                >
                  Closed{" "}
                  {stats.closed > 0 && (
                    <span className="ml-1 opacity-60">{stats.closed}</span>
                  )}
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="px-2 space-y-1">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => setActiveTicket(ticket)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border border-transparent ${
                      activeTicket?.id === ticket.id
                        ? "bg-white border-slate-100 shadow-sm ring-1 ring-slate-100"
                        : "hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-slate-900 text-sm truncate pr-2 leading-none">
                        {ticket.subject}
                      </h4>
                      <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap tracking-tighter">
                        {ticket.ticketId}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mb-2.5 font-medium">
                      {ticket.lastMessage}
                    </p>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 border-t border-slate-50/50 pt-2.5">
                      <div className="flex items-center gap-1.5 grayscale opacity-70">
                        <Avatar className="h-3.5 w-3.5">
                          <AvatarImage src="" />
                          <AvatarFallback className="text-[7px] bg-slate-100 text-slate-500 uppercase font-bold">
                            {ticket.user.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold">{ticket.user}</span>
                      </div>
                      <span className="font-medium">{ticket.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Right Area - Conversation */}
          {activeTicket ? (
            <div className="flex-1 flex flex-col bg-slate-50/20">
              {/* Conversation Header */}
              <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      {activeTicket.subject}
                    </h3>
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <UserIcon className="h-3 w-3" /> {activeTicket.user}
                    </span>
                    <span>#{activeTicket.ticketId}</span>
                    <span>{activeTicket.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {activeTicket.status === "open" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateTicketStatus(activeTicket.id, "in-progress")
                      }
                      className="text-amber-600 border-amber-100 hover:bg-amber-50 hover:text-amber-700 gap-2 font-medium"
                    >
                      <Clock className="h-4 w-4" /> Start Progress
                    </Button>
                  )}
                  {activeTicket.status === "closed" && (
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 border-emerald-100 flex gap-1 items-center px-3 py-1"
                    >
                      <CheckCircle2 className="h-3 w-3" /> Resolved
                    </Badge>
                  )}
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4 md:p-6">
                <div className="space-y-6 max-w-3xl mx-auto">
                  {/* Centered Conversation Divider */}
                  <div className="flex justify-center my-4">
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 bg-white px-3 py-1 border border-slate-100 rounded-full font-semibold">
                      Conversation
                    </span>
                  </div>

                  {/* Messages */}
                  {activeTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-4 ${message.isAdmin ? "flex-row-reverse" : ""}`}
                    >
                      <Avatar className="h-9 w-9 border border-slate-100 shadow-sm">
                        <AvatarImage src="/api/placeholder/40/40" />
                        <AvatarFallback
                          className={
                            message.isAdmin
                              ? "bg-orange-100 text-orange-600"
                              : ""
                          }
                        >
                          {message.sender.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`flex-1 space-y-2 ${message.isAdmin ? "flex flex-col items-end" : ""}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">
                            {message.sender}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {message.time}
                          </span>
                          {!message.isAdmin && (
                            <Badge
                              variant="secondary"
                              className="text-[9px] px-1.5 h-4 font-bold tracking-wider rounded-sm uppercase"
                            >
                              Opener
                            </Badge>
                          )}
                        </div>
                        <div
                          className={`bg-white border border-slate-100 p-4 rounded-2xl ${
                            message.isAdmin
                              ? "rounded-tr-none"
                              : "rounded-tl-none"
                          } shadow-[0_2px_10px_-5px_rgba(0,0,0,0.05)] text-sm text-slate-700 w-fit max-w-[85%]`}
                        >
                          {message.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Reply Area */}
              <div className="p-4 pb-3 bg-white border-t border-slate-100">
                <div className="max-w-3xl mx-auto space-y-3">
                  <div className="relative group">
                    <Textarea
                      placeholder="Type your reply..."
                      className="w-full min-h-[56px] py-4 pl-4 pr-14 bg-slate-50/50 rounded-xl border-none focus-visible:ring-2 focus-visible:ring-indigo-100 resize-none text-sm transition-all"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Button
                        size="icon"
                        className="rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 h-10 w-10"
                        onClick={handleSendMessage}
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium px-2">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <span className="bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100 text-slate-500 font-bold uppercase tracking-tighter text-[9px]">
                          Press Enter
                        </span>
                        <span className="opacity-80">to send</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100 text-slate-500 font-bold uppercase tracking-tighter text-[9px]">
                          Shift+Enter
                        </span>
                        <span className="opacity-80">for new line</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 flex-col gap-4">
              <div className="p-6 rounded-full bg-slate-50">
                <MessageSquare className="h-10 w-10 opacity-20" />
              </div>
              <p className="text-sm font-medium">
                Select a ticket to view conversation
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
