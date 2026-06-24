"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  CheckCircle,
  XCircle,
  Eye,
  SearchX,
  TriangleAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { formatRupiah, formatDate, formatTitleCase } from "@/lib/utils";
import { STATUS_CLASS, MAX_VISIBLE_PAGES } from "@/lib/constants";
import { useUpdateTransaction } from "@/hooks/useTransactions";
import { toast } from "sonner";
import type { Transaction } from "@/models/transaction";

type TransactionTableProps = {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
  limitOptions: number[];
  isLoading: boolean;
  isError: boolean;
  isAdmin: boolean;
  search?: string;
  status?: string;
  onPageChangeAction: (page: number) => void;
  onLimitChangeAction: (limit: number) => void;
  onRowClickAction: (transaction: Transaction) => void;
};

const BASE_COLUMNS = [
  "ID",
  "Nama Pengirim",
  "Bank",
  "Jumlah",
  "Biaya Admin",
  "Status",
  "Tanggal",
];

type ConfirmState = {
  open: boolean;
  action: "APPROVED" | "REJECTED" | null;
  transaction: Transaction | null;
};

export function TransactionTable({
  data,
  total,
  page,
  limit,
  limitOptions,
  isLoading,
  isError,
  isAdmin,
  search,
  status,
  onPageChangeAction,
  onLimitChangeAction,
  onRowClickAction,
}: TransactionTableProps) {
  const updateMutation = useUpdateTransaction();
  const [confirm, setConfirm] = useState<ConfirmState>({
    open: false,
    action: null,
    transaction: null,
  });

  const columns = [...BASE_COLUMNS, "Aksi"];
  const totalPages = Math.ceil(total / limit);
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  function handleStatusUpdate() {
    if (!confirm.transaction || !confirm.action) return;
    updateMutation.mutate(
      { id: confirm.transaction.id, payload: { status: confirm.action } },
      {
        onSuccess: () => {
          toast.success(
            confirm.action === "APPROVED"
              ? "Transaksi berhasil disetujui"
              : "Transaksi berhasil ditolak",
          );
          setConfirm({ open: false, action: null, transaction: null });
        },
        onError: (err) => {
          toast.error(
            err instanceof Error ? err.message : "Gagal mengupdate status",
          );
          setConfirm({ open: false, action: null, transaction: null });
        },
      },
    );
  }

  function getPageNumbers(): (number | "ellipsis")[] {
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "ellipsis")[] = [1];
    if (page > 3) pages.push("ellipsis");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
    return pages;
  }

  if (isError) {
    const hasFilter = (search && search !== "") || (status && status !== "");
    return (
      <div className="flex h-40 items-center justify-center rounded-md border">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <TriangleAlert className="size-8 opacity-40" />
          <span className="text-sm">Gagal memuat data. Silakan coba lagi.</span>
          {hasFilter && (
            <span className="text-xs text-muted-foreground/70">
              Coba periksa kembali filter atau ubah kata kunci pencarian.
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col}>{col}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: limit }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((col) => (
                      <TableCell key={col}>
                        <div className="h-4 w-full animate-pulse rounded bg-muted" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-40 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <SearchX className="size-8 opacity-40" />
                      <span className="text-sm">
                        Tidak ada transaksi ditemukan.
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono text-xs">
                      {row.id}
                    </TableCell>
                    <TableCell>{row.sender_name}</TableCell>
                    <TableCell>{row.bank}</TableCell>
                    <TableCell>{formatRupiah(row.amount)}</TableCell>
                    <TableCell>{formatRupiah(row.admin_fee)}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_CLASS[row.status]}>
                        <span className="mr-0.5 inline-flex size-2 rounded-full bg-current opacity-70" />
                        {formatTitleCase(row.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(row.created_at)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Aksi</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {isAdmin && row.status === "PENDING" && (
                            <>
                              <DropdownMenuItem
                                className="cursor-pointer text-green-600 focus:bg-green-50 focus:text-green-600"
                                onClick={() =>
                                  setConfirm({
                                    open: true,
                                    action: "APPROVED",
                                    transaction: row,
                                  })
                                }
                              >
                                <CheckCircle size={16} className="mr-1" />
                                Setujui
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                                onClick={() =>
                                  setConfirm({
                                    open: true,
                                    action: "REJECTED",
                                    transaction: row,
                                  })
                                }
                              >
                                <XCircle size={16} className="mr-1" />
                                Tolak
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => onRowClickAction(row)}
                          >
                            <Eye size={16} className="mr-1" />
                            Detail
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-muted-foreground sm:justify-start">
            <span className="whitespace-nowrap">
              {total === 0
                ? "Tidak ada transaksi"
                : `Menampilkan ${from}–${to} dari ${total} transaksi`}
            </span>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span>Tampilkan</span>
              <select
                value={limit}
                onChange={(e) => onLimitChangeAction(Number(e.target.value))}
                className="h-7 rounded-md border border-input bg-transparent px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {limitOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <span>baris</span>
            </div>
          </div>

          {totalPages > 1 && (
            <Pagination className="mx-0 sm:mx-auto sm:justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) onPageChangeAction(page - 1);
                    }}
                    aria-disabled={page <= 1 || isLoading}
                    className={
                      page <= 1 || isLoading
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>

                {getPageNumbers().map((p, i) =>
                  p === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href="#"
                        isActive={p === page}
                        onClick={(e) => {
                          e.preventDefault();
                          if (p !== page) onPageChangeAction(p);
                        }}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < totalPages) onPageChangeAction(page + 1);
                    }}
                    aria-disabled={page >= totalPages || isLoading}
                    className={
                      page >= totalPages || isLoading
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirm.open}
        title={
          confirm.action === "APPROVED"
            ? "Setujui Transaksi"
            : "Tolak Transaksi"
        }
        description={
          confirm.action === "APPROVED"
            ? "Transaksi ini akan disetujui. Tindakan ini tidak dapat dibatalkan."
            : "Transaksi ini akan ditolak. Tindakan ini tidak dapat dibatalkan."
        }
        confirmLabel={confirm.action === "APPROVED" ? "Setujui" : "Tolak"}
        confirmVariant={
          confirm.action === "REJECTED" ? "destructive" : "default"
        }
        isPending={updateMutation.isPending}
        onConfirmAction={handleStatusUpdate}
        onCancelAction={() =>
          setConfirm({ open: false, action: null, transaction: null })
        }
      />
    </>
  );
}
