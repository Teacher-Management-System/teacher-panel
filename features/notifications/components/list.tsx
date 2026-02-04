"use client";

import { useState } from "react";
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
  CreditCard,
  UserPlus,
  AlertCircle,
  Check,
} from "lucide-react";

type Notification = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "payment" | "student" | "warning" | "system";
  isRead: boolean;
};

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Payment Verified",
    description:
      "Payment of ₹15,000 for Rahul Sharma has been verified successfully.",
    time: "2 hours ago",
    type: "payment",
    isRead: false,
  },
  {
    id: "2",
    title: "New Student Enrolled",
    description: "Priya Patel has been successfully enrolled in your course.",
    time: "5 hours ago",
    type: "student",
    isRead: false,
  },
  {
    id: "3",
    title: "Pending Verification",
    description:
      "3 student payments are pending verification. Please submit payment proofs.",
    time: "1 day ago",
    type: "warning",
    isRead: false,
  },
  {
    id: "4",
    title: "System Update",
    description:
      "New features have been added to the dashboard. Check out the improvements!",
    time: "2 days ago",
    type: "system",
    isRead: true,
  },
];

export default function NotificationList() {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<
    string | null
  >(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const readCount = notifications.length - unreadCount;

  const handleMarkAsReadClick = (id?: string) => {
    setSelectedNotificationId(id || null);
    setDialogOpen(true);
  };

  const confirmMarkAsRead = () => {
    if (selectedNotificationId) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === selectedNotificationId ? { ...n, isRead: true } : n,
        ),
      );
    } else {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }
    setDialogOpen(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <CreditCard className="h-5 w-5 text-emerald-600" />;
      case "student":
        return <UserPlus className="h-5 w-5 text-cyan-600" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case "system":
        return <Bell className="h-5 w-5 text-slate-600" />;
      default:
        return <Bell className="h-5 w-5 text-slate-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "payment":
        return "bg-emerald-100";
      case "student":
        return "bg-cyan-100";
      case "warning":
        return "bg-orange-100";
      case "system":
        return "bg-slate-100";
      default:
        return "bg-slate-100";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            <Badge className="bg-cyan-500 hover:bg-cyan-600">
              {unreadCount} New
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
          disabled={unreadCount === 0}
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
                {notifications.length}
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
                {unreadCount}
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
                {readCount}
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
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`border transition-all hover:shadow-md ${
                !notification.isRead
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
                      {!notification.isRead && (
                        <span className="h-2 w-2 rounded-full bg-cyan-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {notification.description}
                    </p>
                    <p className="text-xs text-gray-400">{notification.time}</p>
                  </div>
                </div>
                {notification.isRead ? (
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
          ))}
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
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
