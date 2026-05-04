import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import type * as React from "react";

import { Loader } from "lucide-react";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";

import { getCommonPinningStyles } from "@/lib/data-table";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  isLoading?: boolean;
  containerClassName?: string;
  isPending?: boolean;
}

export function DataTable<TData>({
  table,
  actionBar,
  children,
  isLoading,
  className,
  containerClassName,
  isPending,
  ...props
}: DataTableProps<TData>) {
  return (
    <div
      className={cn("flex w-full max-w-full flex-col gap-2.5 overflow-hidden", className)}
      {...props}
    >
      {children}
      <div
        className={cn(
          "relative overflow-x-auto custom-scrollbar rounded-md transition-colors duration-300 min-w-0",
          isPending
            ? "bg-zinc-100/90 border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800"
            : "bg-card dark:bg-transparent border border-border dark:border-border/50",
          containerClassName,
        )}
      >
        {isPending && (
          <div className="absolute top-2 right-2 z-20">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-200/50 px-2 py-0.5 rounded-full border border-zinc-300/50">
              Demo Data
            </span>
          </div>
        )}
        <div
          className={cn(
            isPending && "grayscale opacity-60 pointer-events-none select-none",
          )}
        >
          <Table>
            <TableHeader className="bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-muted/50 border-b border-border"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        ...getCommonPinningStyles({ column: header.column }),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="relative">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          ...getCommonPinningStyles({ column: cell.column }),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {isLoading && (
            <div className="bg-background/80 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader className="size-5 animate-spin" />
                <span className="text-sm font-medium">
                  Loading, please wait...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
        {actionBar &&
          table.getFilteredSelectedRowModel().rows.length > 0 &&
          actionBar}
      </div>
    </div>
  );
}
