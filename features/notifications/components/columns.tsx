"use client";

import { ColumnDef } from "@tanstack/react-table";
import { NotificationItem } from "../model";
import { cn, stripHtml, parseDate } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Clock, Eye, ImageIcon, CheckCircle2, Ban } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function createColumns(
  onMarkAsRead: (id: string) => void,
  onView: (notification: NotificationItem) => void
): ColumnDef<NotificationItem>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
        const notification = row.original;
        return (
          <div 
            className={cn(
              "font-bold max-w-[200px] truncate cursor-pointer hover:underline transition-all",
              !notification.is_read ? "text-cyan-600" : "text-foreground opacity-70"
            )}
            onClick={() => onView(notification)}
          >
            {notification.title}
          </div>
        );
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "attachment",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Attachment" />
      ),
      cell: ({ row }) => {
        const notification = row.original;
        
        const getFirstAttachment = () => {
          let attachments: any = 
            notification.attachments ||
            notification.attachment || 
            (notification as any).image;

          if (!attachments) return null;

          let attachmentStr = "";
          if (Array.isArray(attachments)) {
            attachmentStr = attachments[0];
          } else if (typeof attachments === 'string') {
            if (attachments.includes(',') && !attachments.startsWith('data:')) {
              attachmentStr = attachments.split(',')[0].trim();
            } else if (attachments.startsWith('[') && attachments.endsWith(']')) {
              try {
                const parsed = JSON.parse(attachments);
                attachmentStr = Array.isArray(parsed) ? parsed[0] : attachments;
              } catch (e) {
                attachmentStr = attachments;
              }
            } else {
              attachmentStr = attachments;
            }
          }

          if (!attachmentStr || typeof attachmentStr !== 'string') return null;
          if (attachmentStr.startsWith('http') || attachmentStr.startsWith('data:')) return attachmentStr;
          
          const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
          return `${baseUrl.replace(/\/$/, '')}/${attachmentStr.replace(/^\//, '')}`;
        };

        const firstAttachment = getFirstAttachment();

        if (!firstAttachment) {
          return (
            <div className="text-muted-foreground/30 flex justify-center w-fit px-4">
              <ImageIcon className="h-4 w-4" />
            </div>
          );
        }

        return (
          <div className="relative h-10 w-16 rounded-md overflow-hidden bg-muted border border-border/50 shadow-sm transition-transform hover:scale-105 cursor-zoom-in">
            <img 
              src={firstAttachment} 
              alt="attachment" 
              className="h-full w-full object-cover"
              onClick={() => onView(notification)}
              onError={(e) => {
                (e.target as any).style.display = 'none';
              }}
            />
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return (
          <div className="text-sm text-muted-foreground line-clamp-1 max-w-[300px]" title={stripHtml(description)}>
            {stripHtml(description)}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      id: "acknowledge",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Acknowledge" />
      ),
      cell: ({ row }) => {
        const notification = row.original;
        
        // Use acknowledged property if available, fallback to is_read
        const isAcknowledged = notification.acknowledged ?? notification.is_read;

        if (isAcknowledged) {
          return (
            <Badge 
              variant="outline" 
              className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1 flex items-center gap-1.5 w-fit font-bold rounded-full"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Acknowledged
            </Badge>
          );
        }
        return (
          <Badge 
            variant="outline" 
            className="bg-rose-500/10 text-rose-600 border-rose-500/20 px-3 py-1 flex items-center gap-1.5 w-fit font-bold cursor-pointer hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all group rounded-lg"
            onClick={() => onMarkAsRead(notification.id)}
            title="Click to acknowledge"
          >
            <Ban className="h-3.5 w-3.5 transition-transform group-hover:rotate-12" />
            Not Acknowledged
          </Badge>
        );
      },
    },
    {
      accessorKey: "acknowledged_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Acknowledge At" />
      ),
      cell: ({ row }) => {
        const notification = row.original;
        if (!notification.is_read) return <span className="text-muted-foreground opacity-40 italic text-xs">Pending...</span>;
        
        return (
          <div className="flex flex-col gap-0.5 max-w-[150px] truncate">
            <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(parseDate(notification.acknowledged_at), { addSuffix: true })}
            </div>
            {notification.acknowledged_by && (
              <span className="text-[10px] font-medium text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded-md w-fit">
                By {notification.acknowledged_by}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "send_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Send At" />
      ),
      cell: ({ row }) => {
        const notification = row.original;
        const dateVal =
          notification.send_at ||
          (notification as any).sendAt ||
          notification.scheduled_at ||
          (notification as any).data?.send_at ||
          (notification as any).data?.sendAt ||
          (notification as any).data?.scheduled_at ||
          notification.created_at;

        if (!dateVal)
          return (
            <span className="text-muted-foreground opacity-40 italic text-xs">
              N/A
            </span>
          );

        const date = parseDate(dateVal);
        const formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        const formattedTime = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).toUpperCase();

        return (
          <div className="flex flex-col items-start gap-0.5">
            <span className="font-extrabold italic text-[#0f172a] text-[12px] leading-tight flex items-center gap-1">
              <Clock className="h-3 w-3 text-indigo-500" />
              {formattedDate}
            </span>
            <span className="text-[10px] text-[#64748b] font-semibold tracking-tight pl-4">
              {formattedTime}
            </span>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actions" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-end pr-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 bg-indigo-50/80 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-full border border-indigo-100/50 shadow-sm transition-all duration-300 group"
            onClick={() => onView(row.original)}
            title="View Announcement"
          >
            <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
          </Button>
        </div>
      ),
    },
  ];
}
