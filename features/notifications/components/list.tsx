"use client";

import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { createColumns } from "./columns";
import { NotificationItem } from "../model";
import notificationService from "../api.service";
import { useEffect, useState, useMemo } from "react";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, Megaphone, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function NotificationList() {
  const [data, setData] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);

  // NUQS states (URL params)
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10));
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [status, setStatus] = useQueryState(
    "status",
    parseAsString.withDefault("all"),
  );

  const [refreshKey, setRefreshKey] = useState(0);
  const refreshData = () => setRefreshKey((prev) => prev + 1);

  const [ackDialogOpen, setAckDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<NotificationItem | null>(null);
  const [isMarkingRead, setIsMarkingRead] = useState(false);

  const handleMarkAsReadClick = (id: string) => {
    setSelectedAnnouncement(data.find((n) => n.id === id) || null);
    setAckDialogOpen(true);
  };

  const handleViewDetail = (notification: NotificationItem) => {
    // Just dispatch the global event, the Global AnnouncementDialog will handle displaying it
    window.dispatchEvent(
      new CustomEvent("new-announcement", { detail: notification }),
    );
  };

  const confirmMarkAsRead = async () => {
    setIsMarkingRead(true);
    try {
      if (selectedAnnouncement) {
        await notificationService.markAsRead(selectedAnnouncement.id);
        refreshData();
      }
    } catch (error) {
      console.error("Failed to mark as read", error);
    } finally {
      setIsMarkingRead(false);
      setAckDialogOpen(false);
    }
  };

  const columns = useMemo(
    () => createColumns(handleMarkAsReadClick, handleViewDetail),
    [data],
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    manual: true,
    enableAdvancedFilter: false,
    getRowId: (row) => row.id,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const queryParams = {
          page,
          per_page: perPage,
          search: search || undefined,
          status: status === "all" ? undefined : status,
        };

        const response =
          await notificationService.getNotifications(queryParams);
        if (response?.notifications) {
          setData(response.notifications);
        }
        if (response?.meta) {
          const totalPages = Number(response.meta.total_page);
          setPageCount(!isNaN(totalPages) && totalPages > 0 ? totalPages : 1);
        }
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, perPage, search, status, refreshKey]);

  useEffect(() => {
    const handleRefresh = () => {
      refreshData();
    };

    // When a new announcement comes through Socket OR one is read globally, refresh the table
    window.addEventListener("new-announcement", handleRefresh);
    window.addEventListener("announcement-read", handleRefresh);
    return () => {
      window.removeEventListener("new-announcement", handleRefresh);
      window.removeEventListener("announcement-read", handleRefresh);
    };
  }, []);

  const clearFilters = () => {
    setSearch(null);
    setStatus("all");
  };

  const hasFilters = !!search || status !== "all";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Announcements
            </h1>
            <Badge className="bg-cyan-500/10 text-cyan-600 border-cyan-500/20 shadow-none px-3 py-1 scale-110">
              Management
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            Detailed view and tracking of system announcements
          </p>
        </div>
      </div>

      {/* <Card className="rounded-2xl border bg-card/30 backdrop-blur-sm shadow-sm overflow-hidden">
        <CardContent className="p-6 space-y-6"> */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-4 w-full">
          <div className="relative flex-1 md:max-w-md w-full group !h-[48px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground/60 transition-colors group-focus-within:text-cyan-600" />
            <Input
              placeholder="Search by announcement title..."
              value={search ?? ""}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-11 !h-full py-0 w-full bg-background border-2 border-muted hover:border-muted-foreground/20 focus:border-cyan-500/50 rounded-2xl shadow-sm transition-all font-bold text-sm placeholder:text-muted-foreground/40 !box-border !leading-[1] overflow-hidden"
            />
          </div>

          <div className="w-[220px] hidden sm:block flex-shrink-0 !h-[48px] !min-h-[48px] !max-h-[48px] overflow-hidden">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="!h-full py-0 bg-background border-2 border-muted rounded-2xl font-bold text-sm focus:ring-cyan-500/20 px-4 !box-border !leading-[1] overflow-hidden">
                <div className="flex items-center gap-2">
                  <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-muted shadow-xl">
                <SelectItem
                  value="all"
                  className="font-medium focus:bg-cyan-50 focus:text-cyan-600 rounded-lg"
                >
                  All Announcements
                </SelectItem>
                <SelectItem
                  value="acknowledged"
                  className="font-medium focus:bg-emerald-50 focus:text-emerald-600 rounded-lg text-emerald-600"
                >
                  Acknowledged
                </SelectItem>
                <SelectItem
                  value="unacknowledged"
                  className="font-medium focus:bg-rose-50 focus:text-rose-600 rounded-lg text-rose-600"
                >
                  Not Acknowledged
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-10 px-4 text-muted-foreground hover:text-cyan-600 hover:bg-cyan-50 rounded-xl ml-auto sm:ml-0"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* <div className="rounded-xl overflow-hidden border border-border/50 bg-background/50 shadow-sm"> */}
      <DataTable table={table} isLoading={loading} isPending={false} />
      {/* </div> */}
      {/* </CardContent>
      </Card> */}

      {/* Acknowledge Dialog (Keep here for manual acknowledge from button) */}
      <Dialog open={ackDialogOpen} onOpenChange={setAckDialogOpen}>
        <DialogContent className="rounded-3xl border-none shadow-2xl overflow-hidden max-w-[400px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
          <DialogHeader className="space-y-4 pt-4">
            <div className="mx-auto bg-cyan-500/10 p-4 rounded-3xl w-fit">
              <Megaphone className="h-8 w-8 text-cyan-600" />
            </div>
            <div className="text-center">
              <DialogTitle className="text-2xl font-bold">
                Acknowledge Announcement
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium pt-2 px-4">
                Confirm that you have read this announcement.
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className="flex sm:justify-center gap-3 pb-4 pt-6">
            <Button
              variant="outline"
              onClick={() => setAckDialogOpen(false)}
              className="rounded-xl px-8 border-cyan-100 hover:bg-cyan-50 text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmMarkAsRead}
              className="bg-cyan-600 hover:bg-cyan-700 rounded-xl px-8 shadow-lg shadow-cyan-600/20"
              disabled={isMarkingRead}
            >
              {isMarkingRead ? "Updating..." : "Acknowledge"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
