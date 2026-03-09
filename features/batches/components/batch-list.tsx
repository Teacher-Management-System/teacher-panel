"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, Filter, X } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { columns } from "./columns";
import { Batch } from "../model";
import batchService from "../api.service";
import { useQueryState, parseAsInteger } from "nuqs";
import { AddBatchDialog } from "./add-batch-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BatchList() {
  const [data, setData] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(15));

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response: any = await batchService.list({
        search: search || undefined,
        status: status || undefined,
        page: page,
        per_page: perPage,
      });

      if (response?.batches) {
        setData(response.batches);
      } else if (Array.isArray(response)) {
        setData(response);
      } else {
        setData([]);
      }

      if (response?.meta) {
        const totalPages = Number(response.meta.total_page);
        setPageCount(!isNaN(totalPages) && totalPages > 0 ? totalPages : 1);
      }
    } catch (error) {
      console.error("Failed to fetch batches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [search, status, page, perPage]);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    manual: true,
    meta: {
      onRefresh: fetchBatches,
    },
  });

  const clearFilters = () => {
    setSearch("");
    setStatus(null);
  };

  const hasFilters = !!search || !!status;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Batches
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your teaching batches and schedules
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AddBatchDialog onSuccess={fetchBatches} />
        </div>
      </div>

      <Card className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <CardContent className="p-6 space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:max-w-xs w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search batches..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="pl-9 h-9 w-full bg-background border-input focus-visible:ring-1"
                />
              </div>
              <Select
                value={status ?? undefined}
                onValueChange={(val) => setStatus(val === "all" ? null : val)}
              >
                <SelectTrigger className="w-[140px] h-9 border-dashed">
                  <div className="flex items-center gap-2">
                    <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-9 px-2 text-muted-foreground hover:text-primary"
                >
                  Reset
                  <X className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-md bg-background overflow-hidden">
            <DataTable table={table} isLoading={loading} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
