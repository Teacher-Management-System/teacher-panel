"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  Check,
  Info,
  AlertTriangle,
} from "lucide-react";
import { NotificationItem } from "../model";
import notificationService from "../api.service";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function NotificationList() {
  // Use state for the full response data if needed, or just items
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [counts, setCounts] = useState({
    total: 0,
    unread: 0,
    read: 0,
  });
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<
    string | null
  >(null);
  const [isMarkingRead, setIsMarkingRead] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications();
      if (response && response.notifications) {
        setNotifications(response.notifications);
        // Calculate counts from loaded data or meta since BaseService might strip root counters
        // Using current page data for unread/read counts as fallback
        const unread = response.notifications.filter((n) => !n.is_read).length;
        setCounts({
          total: response.meta?.total_item || response.notifications.length,
          unread: unread,
          read:
            (response.meta?.total_item || response.notifications.length) -
            unread,
        });
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsReadClick = (id?: string) => {
    setSelectedNotificationId(id || null);
    setDialogOpen(true);
  };

  const confirmMarkAsRead = async () => {
    setIsMarkingRead(true);
    try {
      if (selectedNotificationId) {
        // Optimistic update for single item
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === selectedNotificationId ? { ...n, is_read: true } : n,
          ),
        );
        setCounts((prev) => ({
          ...prev,
          unread: Math.max(0, prev.unread - 1),
          read: prev.read + 1,
        }));
        await notificationService.markAsRead(selectedNotificationId);
      } else {
        // Optimistic update for all
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        setCounts((prev) => ({
          ...prev,
          unread: 0,
          read: prev.total,
        }));
        await notificationService.markAsRead();
      }
      toast.success("Marked as read");
    } catch (error) {
      console.error("Failed to mark as read", error);
      toast.error("Failed to update status");
      // Revert optimistic update nicely? For now, we trust.
    } finally {
      setIsMarkingRead(false);
      setDialogOpen(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
      case "info":
        return <Info className="h-5 w-5 text-cyan-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Bell className="h-5 w-5 text-slate-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-emerald-100";
      case "info":
        return "bg-cyan-100";
      case "warning":
        return "bg-orange-100";
      case "error":
        return "bg-red-100";
      default:
        return "bg-slate-100";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            <Badge className="bg-cyan-500 hover:bg-cyan-600">
              {counts.unread} New
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Stay updated with your latest activities
          </p>
        </div>
        <Button
          variant="outline"
          className="border-cyan-200 text-cyan-600 hover:bg-cyan-50 hover:text-cyan-700"
          onClick={() => handleMarkAsReadClick()}
          disabled={counts.unread === 0}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Mark All as Read
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-xl border shadow-sm">
          <CardContent className="flex items-center gap-4 px-6">
            <div className="rounded-full bg-cyan-50 p-3 text-cyan-600">
              <Bell className="h-6 w-6 relative" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {counts.total}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border shadow-sm">
          <CardContent className="flex items-center gap-4 px-6">
            <div className="rounded-full bg-orange-50 p-3 text-orange-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Unread</p>
              <h3 className="text-2xl font-bold text-orange-600">
                {counts.unread}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border shadow-sm">
          <CardContent className="flex items-center gap-4 px-6">
            <div className="rounded-full bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Read</p>
              <h3 className="text-2xl font-bold text-emerald-600">
                {counts.read}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-cyan-600" />
          <h2 className="text-lg font-semibold">Recent Notifications</h2>
        </div>

        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No notifications found
            </div>
          ) : (
            notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`border transition-all hover:shadow-md ${
                  !Boolean(notification.is_read)
                    ? "bg-cyan-50/30 border-cyan-100"
                    : "bg-white"
                }`}
              >
                <CardContent className="flex items-start justify-between px-6">
                  <div className="flex gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${getBgColor(
                        notification.type,
                      )}`}
                    >
                      {getIcon(notification.type)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">
                          {notification.title}
                        </h4>
                        {!Boolean(notification.is_read) && (
                          <span className="h-2 w-2 rounded-full bg-cyan-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {notification.description}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDistanceToNow(
                          new Date(notification.created_at),
                          { addSuffix: true },
                        )}
                      </p>
                    </div>
                  </div>
                  {Boolean(notification.is_read) ? (
                    <Badge
                      variant="secondary"
                      className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Read
                    </Badge>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-cyan-200 text-cyan-600 hover:bg-cyan-50 hover:text-cyan-700"
                      onClick={() => handleMarkAsReadClick(notification.id)}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Read
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Read</DialogTitle>
            <DialogDescription>
              {selectedNotificationId
                ? "Are you sure you want to mark this notification as read?"
                : "Are you sure you want to mark all notifications as read?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmMarkAsRead}
              className="bg-cyan-600 hover:bg-cyan-700"
              disabled={isMarkingRead}
            >
              {isMarkingRead ? "Updating..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
