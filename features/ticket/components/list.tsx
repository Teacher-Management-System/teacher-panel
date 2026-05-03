"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { AddTicketDialog } from "./add-ticket-dialog";
import { ReopenTicketDialog } from "./reopen-ticket-dialog";
import { showTicketNotice } from "./ticket-notification-toast";
import { useAuth } from "@/hooks/useAuth";

import { toast } from "sonner";
import { ticketService } from "../api.service";
import { Ticket as ApiTicket } from "../model";
import { getEcho } from "@/lib/echo";
import { stripHtml } from "@/lib/utils";
import { useQueryState } from "nuqs";

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
  const router = useRouter();

  // Read ticketId from URL once on mount (for notification navigation). Not reactive.
  const initialTicketIdRef = useRef<string | null>(
    searchParams.get("ticketId"),
  );
  const didHandleInitialTicket = useRef(false);
  const currentUrlTicketId = searchParams.get("ticketId");

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
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [allRawTickets, setAllRawTickets] = useState<ApiTicket[]>([]);
  const [allMappedTickets, setAllMappedTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState({ pending: 0, open: 0, closed: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollHeightRef = useRef<number>(0);
  const isInitialLoad = useRef<boolean>(true);
  const shouldScrollToBottomRef = useRef<boolean>(true);
  const isBackgroundRefresh = useRef<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // React to URL changes (when clicking notifications while already on the page)
  useEffect(() => {
    // Only run if we actually have tickets loaded
    if (!currentUrlTicketId || tickets.length === 0) return;

    // Check if it's already active
    if (
      activeTicket &&
      (activeTicket.id === currentUrlTicketId ||
        activeTicket.ticketId === currentUrlTicketId ||
        activeTicket.ticketId === `T-${currentUrlTicketId}`)
    ) {
      return;
    }

    const targetTicket = tickets.find(
      (t) =>
        t.id === currentUrlTicketId ||
        t.ticketId === currentUrlTicketId ||
        t.ticketId === `T-${currentUrlTicketId}`,
    );

    if (targetTicket) {
      setActiveTicket(targetTicket);
      setMessagesLoading(true);
    } else {
      // It might be in another tab, fetch details to switch tab
      ticketService
        .getTickets()
        .then((allRes: any) => {
          if (allRes?.tickets) {
            const found = allRes.tickets.find(
              (t: ApiTicket) =>
                String(t.id) === currentUrlTicketId ||
                String((t as any).ticket_number) === currentUrlTicketId,
            );
            if (found && found.status !== activeTab) {
              setActiveTab(found.status as any);
              // Active ticket will be set by fetchTickets/useEffect once tab switches and tickets fetch
            }
          }
        })
        .catch(console.error);
    }
  }, [currentUrlTicketId, tickets, activeTicket?.id, activeTab]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response: any = await ticketService.getTickets();
        if (response && response.tickets) {
          const allTickets: ApiTicket[] = response.tickets;
          setAllRawTickets(allTickets);
          setStats({
            pending: allTickets.filter((t) => t.status === "pending").length,
            open: allTickets.filter((t) => t.status === "open").length,
            closed: allTickets.filter((t) => t.status === "closed").length,
          });
          const mappedAllTickets: Ticket[] = allTickets.map((t: ApiTicket) => ({
            id: String(t.id),
            subject: t.subject,
            lastMessage: t.description,
            status: t.status,
            user: t.user?.name || "Unknown",
            userId: String(t.user?.id || ""),
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
          }));
          setAllMappedTickets(mappedAllTickets);
        }
      } catch (error) {
        console.error("Failed to fetch ticket stats:", error);
      }
    };
    fetchStats();
  }, [refreshTrigger]);

  // Handle cross-tab automatic navigation on search
  useEffect(() => {
    if (!searchTerm.trim() || allRawTickets.length === 0) return;

    const term = searchTerm.toLowerCase().trim();

    // Find all matches
    const allMatches = allRawTickets.filter((t: any) => {
      const subjectMatch = t.subject?.toLowerCase().includes(term);
      const idStr = t.ticket_number
        ? String(t.ticket_number).toLowerCase()
        : "";
      const idMatch =
        idStr.includes(term) ||
        String(t.id).toLowerCase().includes(term) ||
        `t-${idStr}`.includes(term);
      const descMatch = stripHtml(t.description || "")
        .toLowerCase()
        .includes(term);
      return subjectMatch || idMatch || descMatch;
    });

    if (allMatches.length === 0) return; // Ignore if no match at all

    // Check if current tab has any of the matches
    const hasMatchInCurrentTab = allMatches.some(
      (t: any) => t.status === activeTab,
    );

    // If current tab has NO matches, but we found a match in another tab, switch to it!
    if (!hasMatchInCurrentTab) {
      const firstMatchTab = allMatches[0].status;
      if (firstMatchTab) {
        setActiveTab(firstMatchTab as "pending" | "open" | "closed");
      }
    }
  }, [searchTerm, allRawTickets, activeTab, setActiveTab]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        if (!isBackgroundRefresh.current) {
          setListLoading(true);
        }
        isBackgroundRefresh.current = false;
        const statusParam = activeTab || "open";
        console.log(`📡 FETCHING tickets for status: ${statusParam}`);
        const response: any = await ticketService.getTickets(statusParam);

        // Robustly find the tickets array in the response
        const ticketsArray = Array.isArray(response)
          ? response
          : response?.tickets || response?.data || [];

        console.log(
          `✅ TICKETS RECEIVED: ${ticketsArray.length} items`,
          ticketsArray,
        );

        if (Array.isArray(ticketsArray)) {
          const mappedTickets: Ticket[] = ticketsArray.map((t: ApiTicket) => ({
            id: String(t.id),
            subject: t.subject,
            lastMessage: t.description,
            status: t.status,
            user: t.user?.name || "Unknown",
            userId: String(t.user?.id || ""),
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
          }));
          setTickets((prev) => {
            return mappedTickets.map((newT) => {
              const oldT = prev.find((p) => p.id === newT.id);
              if (oldT && oldT.messages.length > 1) {
                return {
                  ...newT,
                  messages: oldT.messages,
                  lastMessage: oldT.lastMessage,
                };
              }
              return newT;
            });
          });

          // Preserve messages for currently active ticket across refreshes
          setActiveTicket((prevActive) => {
            if (!prevActive) return null;
            const updatedTicket = mappedTickets.find(
              (t) => t.id === prevActive.id,
            );
            if (updatedTicket) {
              return {
                ...updatedTicket,
                messages: prevActive.messages,
                lastMessage: prevActive.lastMessage,
              };
            }
            return prevActive;
          });

          // One-time: handle ticketId from URL on first load (notification navigation)
          if (!didHandleInitialTicket.current && initialTicketIdRef.current) {
            didHandleInitialTicket.current = true;
            const urlTicketId = initialTicketIdRef.current;
            const targetTicket = mappedTickets.find(
              (t) =>
                t.id === urlTicketId ||
                t.ticketId === urlTicketId ||
                t.ticketId === `T-${urlTicketId}`,
            );
            if (targetTicket) {
              setActiveTicket(targetTicket);
              setMessagesLoading(true);
            } else {
              // Ticket may be in a different tab - check all tickets
              ticketService
                .getTickets()
                .then((allRes: any) => {
                  if (allRes?.tickets) {
                    const found = allRes.tickets.find(
                      (t: ApiTicket) =>
                        String(t.id) === urlTicketId ||
                        String((t as any).ticket_number) === urlTicketId,
                    );
                    if (found && found.status !== activeTab) {
                      setActiveTab(found.status as any);
                    }
                  }
                })
                .catch(console.error);
            }
          }
        } else {
          setTickets([]);
          if (!activeTicket) setActiveTicket(null);
        }
      } catch (error) {
        console.error("❌ FAILED to fetch tickets:", error);
      } finally {
        console.log(
          "🔄 fetchTickets FINISHED, setting loading states to false",
        );
        setListLoading(false);
        setLoading(false);
      }
    };

    fetchTickets();
  }, [activeTab, refreshTrigger]);

  useEffect(() => {
    const handleTicketUpdate = (event: any) => {
      console.log("📥 RECEIVED ticket-updated event:", event.detail);
      const data = event.detail;
      const ticketId = String(data.ticket_id || data.data?.ticket_id || "");
      const ticketNumber = String(data.ticket_number || "");
      const isOpen = data.is_open;
      const isClosed = data.is_closed;
      const isPending = data.is_pending;

      // Robust matching helper
      const isMatch = (t: any) => {
        if (!t) return false;
        const matchById = ticketId && String(t.id) === ticketId;
        const matchByNumber =
          ticketNumber &&
          (String(t.ticketId) === ticketNumber ||
            String(t.ticketId) === `T-${ticketNumber}`);
        return matchById || matchByNumber;
      };

      const activeMatch = activeTicket && isMatch(activeTicket);
      const anyMatchInList = tickets.some((t) => isMatch(t));

      // 1. Update active ticket status immediately for real-time unlock and tab switch
      if (activeMatch || anyMatchInList) {
        console.log(
          `✅ MATCH found (Active: ${!!activeMatch}, In List: ${!!anyMatchInList}). Checking status transition...`,
        );

        if (isOpen) {
          console.log("🔄 Forcing Tab Switch to 'open'...");
          if (activeMatch) {
            setActiveTicket((prev) =>
              prev ? { ...prev, status: "open" } : null,
            );
          }
          setActiveTab("open"); // Auto-switch tab to 'open'
        } else if (isClosed) {
          console.log("🔄 Forcing Tab Switch to 'closed'...");
          if (activeMatch) {
            setActiveTicket((prev) =>
              prev ? { ...prev, status: "closed" } : null,
            );
          }
          setActiveTab("closed"); // Auto-switch tab to 'closed'
        } else if (isPending) {
          console.log("🔄 Forcing Tab Switch to 'pending'...");
          if (activeMatch) {
            setActiveTicket((prev) =>
              prev ? { ...prev, status: "pending" } : null,
            );
          }
          setActiveTab("pending"); // Auto-switch tab to 'pending'
        }
      }

      // 2. Update the tickets array locally to reflect status change immediately
      if (isOpen || isClosed || isPending) {
        setTickets((prev) =>
          prev.map((t) =>
            isMatch(t)
              ? {
                  ...t,
                  status: isOpen ? "open" : isClosed ? "closed" : "pending",
                }
              : t,
          ),
        );
      }

      isBackgroundRefresh.current = true;
      setRefreshTrigger((prev) => prev + 1);
    };

    window.addEventListener("ticket-updated", handleTicketUpdate);
    return () =>
      window.removeEventListener("ticket-updated", handleTicketUpdate);
  }, [activeTicket?.id, activeTicket?.ticketId, tickets, setActiveTab]);

  const [messagesLoading, setMessagesLoading] = useState(false);
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

  useEffect(() => {
    isInitialLoad.current = true;
    shouldScrollToBottomRef.current = true;
    if (typeof window !== "undefined") {
      if (activeTicket) {
        (window as any).currentActiveTicketId = activeTicket.id;
        (window as any).currentActiveTicketNumber = activeTicket.ticketId; // e.g., 'T-1002'
      } else {
        (window as any).currentActiveTicketId = null;
        (window as any).currentActiveTicketNumber = null;
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        (window as any).currentActiveTicketId = null;
        (window as any).currentActiveTicketNumber = null;
      }
    };
  }, [activeTicket?.id, activeTicket?.ticketId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeTicket?.id) {
        setMessagesLoading(false);
        return;
      }

      console.log(`📡 FETCHING messages for ticket: ${activeTicket.id}`);
      try {
        setMessagesLoading(true);
        const firstPageResponse: any = await ticketService.getMessages(
          activeTicket.id,
          1,
        );

        let finalMessages = [];
        let targetPage = 1;

        if (firstPageResponse && firstPageResponse.messages) {
          const total =
            (firstPageResponse.meta && firstPageResponse.meta.total_page) || 1;
          setTotalPages(total);
          targetPage = total;

          let response = firstPageResponse;
          if (total > 1) {
            console.log(
              `📖 Multiple pages detected (${total}), fetching last page...`,
            );
            response = await ticketService.getMessages(activeTicket.id, total);
          }

          if (response && response.messages) {
            finalMessages = response.messages;
          }
        }

        if (finalMessages.length > 0) {
          const mappedMessages: Message[] = finalMessages.map((m: any) => ({
            id: String(m.id),
            text: m.body || m.message || "",
            sender: m.sender?.name || m.user?.name || "Unknown",
            senderId: String(m.sender?.id || m.sender_id || ""),
            time: new Date(m.createdAt * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isAdmin:
              m.isAdmin !== undefined
                ? m.isAdmin
                : (m.sender?.name || m.user?.name || "")
                  .trim()
                  .toLowerCase() !== activeTicket.user?.trim().toLowerCase(),
          }));

          setCurrentPage(targetPage);
          setActiveTicket((prev) =>
            prev && prev.id === activeTicket.id
              ? { ...prev, messages: mappedMessages }
              : prev,
          );
          isInitialLoad.current = false;
          console.log(`✅ LOADED ${mappedMessages.length} messages`);
        } else {
          console.log(
            "ℹ️ No messages found for this ticket (beyond description)",
          );
        }
      } catch (error) {
        console.error("❌ FAILED to fetch messages:", error);
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

  const filteredTickets = (
    searchTerm.trim() ? allMappedTickets : tickets
  ).filter((ticket) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();

    const subjectMatch = ticket.subject?.toLowerCase().includes(term);
    const idMatch =
      ticket.ticketId?.toLowerCase().includes(term) ||
      ticket.id?.toLowerCase().includes(term);
    const descMatch = stripHtml(ticket.lastMessage || "")
      .toLowerCase()
      .includes(term);

    return subjectMatch || idMatch || descMatch;
  });

  const addTicket = async (data: { subject: string; message: string }) => {
    try {
      setLoading(true);
      const response: any = await ticketService.createTicket(
        data.subject,
        data.message,
      );
      await setActiveTab("pending");
      const newTicketId =
        response?.uuid ||
        response?.id ||
        response?.ticket?.id ||
        response?.ticket?.uuid;
      const [ticketsResponse, statsResponse]: any = await Promise.all([
        ticketService.getTickets("pending"),
        ticketService.getTickets(),
      ]);

      if (ticketsResponse && ticketsResponse.tickets) {
        const mappedTickets = ticketsResponse.tickets.map((t: ApiTicket) => ({
          id: String(t.id),
          subject: t.subject,
          lastMessage: t.description,
          status: t.status,
          user: t.user?.name || "Unknown",
          userId: String(t.user?.id || ""),
          date: new Date(t.createdAt * 1000).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          ticketId: `T-${t.ticket_number}`,
          messages: [],
        }));
        setTickets(mappedTickets);
        const ticketToOpen = newTicketId
          ? mappedTickets.find((t: any) => t.id === newTicketId)
          : mappedTickets[0]; // Fallback to newest if ID not found

        if (ticketToOpen) {
          setActiveTicket(ticketToOpen);
          setMessagesLoading(true);
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

  const handleReopenTicket = async (description: string) => {
    if (!activeTicket) return;

    try {
      setLoading(true);
      await ticketService.reopenTicket(activeTicket.id, description);
      toast.success("Ticket reopened successfully");
      setRefreshTrigger((prev) => prev + 1);
      setActiveTab("pending");
      if (activeTicket) {
        setActiveTicket({ ...activeTicket, status: "pending" });
        setTickets((prev) =>
          prev.map((t) =>
            t.id === activeTicket.id ? { ...t, status: "pending" } : t,
          ),
        );
      }
    } catch (error) {
      toast.error("Failed to reopen ticket");
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
      console.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-auto md:h-[calc(100vh-3rem)] bg-background md:py-3 space-y-4 md:space-y-6 md:overflow-hidden">
      <Card className="rounded-[20px] md:rounded-[20px] border border-border/50 shadow-sm bg-card overflow-hidden shrink-0">
        <CardContent className="px-4 md:px-8 flex flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <div className="relative group shrink-0">
              <div className="absolute inset-0 bg-primary/20 blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative p-2.5 md:p-3.5 bg-primary rounded-[15px] md:rounded-[20px] shadow-lg shadow-primary/20 flex items-center justify-center">
                <Ticket className="h-5 w-5 md:h-7 md:w-7 text-white" />
                <div className="absolute -bottom-1 -right-0.5 h-5 w-5 md:h-6 md:w-6 bg-[#22C55E] rounded-lg border-[3px] border-white flex items-center justify-center shadow-sm">
                  <Plus className="h-2.5 w-2.5 md:h-3 md:w-3 text-white stroke-[4]" />
                </div>
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg md:text-[22px] font-black text-foreground tracking-tight flex items-center gap-2 truncate">
                Support Center
              </h1>
              <p className="text-muted-foreground text-[9px] md:text-[13px] font-medium leading-none mt-1.5 flex items-center gap-1.5 truncate">
                Resolution hub for all teacher inquiries
                <span className="flex items-center gap-1.5 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-border">
                  <span className="text-primary font-black italic tracking-wider">
                    V2.0
                  </span>
                </span>
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-5">
            <div className="flex items-center bg-muted/40 rounded-[20px] px-5 py-2.5 border border-border/40 gap-4 h-12">
              <div className="flex items-center gap-2.5">
                <div className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(251,146,60,0.5)] shrink-0" />
                <span className="text-[11px] font-black text-foreground uppercase tracking-wider">
                  {loading ? ".." : stats.pending} Pending
                </span>
              </div>
              <div className="w-[1px] h-4 bg-border/60" />
              <div className="flex items-center gap-2.5">
                <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(31,192,199,0.5)] shrink-0" />
                <span className="text-[11px] font-black text-foreground uppercase tracking-wider">
                  {loading ? ".." : stats.open} Open
                </span>
              </div>
              <div className="w-[1px] h-4 bg-border/60" />
              <div className="flex items-center gap-2.5">
                <div className="h-2 w-2 rounded-full bg-muted-foreground/40 shrink-0" />
                <span className="text-[11px] font-black text-foreground uppercase tracking-wider">
                  {loading ? ".." : stats.closed} Closed
                </span>
              </div>
            </div>
            <AddTicketDialog
              onAddTicket={addTicket}
              className="rounded-[20px] bg-[#0F172A] hover:bg-[#1E293B] h-12 px-8 text-white font-black flex items-center gap-3 border-none transition-all active:scale-95 whitespace-nowrap"
            />
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center shrink-0">
            <AddTicketDialog
              onAddTicket={addTicket}
              className="rounded-xl bg-[#0F172A] hover:bg-[#1E293B] h-10 w-10 text-white flex items-center justify-center transition-all active:scale-90"
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col md:flex-row gap-4 md:gap-6 min-h-0 md:overflow-hidden relative ${activeTicket ? "h-[calc(100vh-10rem)] md:h-auto" : "h-auto"}`}
      >
        {/* Left Sidebar - Ticket List */}
        <Card
          className={`w-full py-0 md:w-[360px] flex-1 md:flex-none flex flex-col transition-all duration-300 bg-card rounded-[20px] md:rounded-[28px] shadow-sm border border-border overflow-hidden ${activeTicket ? "hidden md:flex" : "flex"}`}
        >
          {/* Header section (Search + Tabs) */}
          <div className="p-4 md:p-5 flex flex-col gap-4 md:gap-5 border-b border-border/40 bg-card/80">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search by ID or Subject..."
                className="pl-11 bg-muted border-transparent h-12 rounded-2xl focus-visible:ring-primary/10 focus-visible:bg-background transition-all text-[15px] font-medium placeholder:text-muted-foreground/40"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex p-1.5 bg-muted/50 rounded-2xl border border-border relative z-20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
              {(["pending", "open", "closed"] as const).map((tab) => {
                const currentTab = activeTab || "open";
                const isActive = currentTab === tab;
                return (
                  <Button
                    key={tab}
                    variant="ghost"
                    size="sm"
                    className={`flex-1 h-10 text-[11px] font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 cursor-pointer select-none transition-all duration-300 ${isActive
                        ? "bg-background text-primary shadow-sm border border-border/50 scale-[1.02]"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                      }`}
                    onClick={() => {
                      setActiveTab(tab);
                    }}
                  >
                    {tab}
                    {stats[tab] > 0 && (
                      <span
                        className={`px-1.5 py-0.5 rounded-md text-[10px] transition-colors ${isActive
                            ? "bg-primary/10 text-primary"
                            : "bg-muted-foreground/10 text-muted-foreground"
                          }`}
                      >
                        {stats[tab]}
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 md:px-4 py-1 bg-muted/20 overflow-y-auto custom-scrollbar">
            {listLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-3 pb-4">
                {filteredTickets.map((ticket) => (
                  <Card
                    key={ticket.id}
                    onClick={() => {
                      if (activeTicket?.id !== ticket.id) {
                        setMessagesLoading(true);
                        setActiveTicket(ticket);
                      }
                    }}
                    className={`rounded-[20px] md:rounded-[28px] cursor-pointer transition-all duration-300 border shadow-sm relative group overflow-hidden ${activeTicket?.id === ticket.id
                        ? "bg-card border-primary/40 shadow-primary/5 scale-[1.02] z-10"
                        : "bg-card/40 border-border hover:border-primary/20 hover:shadow-primary/5 hover:translate-x-1"
                      }`}
                  >
                    <div className="px-3 relative">
                      {activeTicket?.id === ticket.id && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1.5 bg-primary rounded-r-full shadow-[0_0_10px_rgba(31,192,199,0.3)]" />
                      )}
                      <div className="flex flex-col gap-1.5 pl-1.5 md:pl-2">
                        <div className="flex justify-between items-center pb-2 border-b border-border/60">
                          <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-bold uppercase tracking-wider">
                            <span className="text-primary bg-primary/10 px-1.5 py-0.5 rounded-[6px]">
                              {ticket.ticketId}
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground/60">
                              <Clock className="w-3 h-3" />
                              {ticket.date}
                            </span>
                          </div>
                          <Badge
                            className={`text-[8px] uppercase font-black px-1.5 py-0.5 rounded border-transparent shrink-0 leading-none ${ticket.status === "pending"
                                ? "bg-orange-500/10 text-orange-500"
                                : ticket.status === "open"
                                  ? "bg-primary/10 text-primary border-primary/20"
                                  : "bg-muted-foreground/10 text-muted-foreground"
                              }`}
                          >
                            {ticket.status}
                          </Badge>
                        </div>
                        <div className="flex flex-col">
                          <h4
                            className={`capitalize font-bold text-[14px] leading-tight transition-colors line-clamp-1 ${activeTicket?.id === ticket.id
                                ? "text-primary"
                                : "text-foreground"
                              }`}
                          >
                            {ticket.subject}
                          </h4>
                          <p className="text-[12px] text-foreground/60 line-clamp-1 leading-snug font-medium mt-0.5 pt-1">
                            {stripHtml(ticket.lastMessage)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Right Area - Conversation */}
        {listLoading || messagesLoading ? (
          <div
            className={`flex-1 flex flex-col items-center justify-center bg-card md:rounded-[20px] border border-border shadow-sm p-10 ${!activeTicket ? "hidden md:flex" : "flex fixed inset-0 z-[100] md:relative md:z-auto"}`}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground font-medium">
              Loading messages...
            </p>
          </div>
        ) : activeTicket ? (
          <div className="flex-1 flex flex-col min-h-0 bg-card md:rounded-[20px] shadow-sm border border-border overflow-hidden fixed inset-0 md:relative z-[100] md:z-auto">
            {/* Conversation Header */}
            <div className="md:px-8 py-3 border-b border-border/50 flex justify-between items-center bg-card/50 backdrop-blur-md">
              <div className="flex items-center gap-2 md:gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-8 w-8 bg-muted rounded-lg border border-border"
                  onClick={() => {
                    setActiveTicket(null);
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
                            {activeTicket.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {activeTicket.status === "closed" && (
                  <ReopenTicketDialog
                    onReopenTicket={handleReopenTicket}
                    className="rounded-lg md:rounded-xl bg-primary hover:bg-primary/90 h-8 md:h-10 px-3 md:px-5 shadow-lg shadow-primary/20 text-[11px] md:text-[13px] text-white font-black flex items-center gap-2 border-none transition-all active:scale-95 whitespace-nowrap"
                  />
                )}
              </div>
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
                          className={`w-8 h-8 md:w-11 md:h-11 rounded-full border-2 md:border-4 border-card shadow-md flex items-center justify-center overflow-hidden ${isMe
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
                            className={`text-[7px] md:text-[8px] font-black uppercase tracking-tight md:tracking-widest px-1 md:px-1.5 py-0.5 rounded-md ${message.isAdmin
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
                          className={`px-4 py-2 md:px-5 md:py-3 rounded-xl md:rounded-[22px] shadow-sm text-[14px] md:text-[15px] font-medium leading-relaxed ${isMe
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
                  <div className="py-6 px-8 bg-muted rounded-2xl border border-dashed border-border text-center flex flex-col items-center gap-2">
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
