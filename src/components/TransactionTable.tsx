"use client";

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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRupiah, formatDate } from "@/lib/utils";
import { STATUS_VARIANT } from "@/lib/constants";
import type { Transaction } from "@/models/transaction";

const MAX_VISIBLE_PAGES = 5;


type TransactionTableProps = {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
  limitOptions: number[];
  isLoading: boolean;
  isError: boolean;
  onPageChangeAction: (page: number) => void;
  onLimitChangeAction: (limit: number) => void;
  onRowClickAction: (transaction: Transaction) => void;
};

const COLUMNS = ["ID", "Nama Pengirim", "Bank", "Jumlah", "Biaya Admin", "Status", "Tanggal", "Aksi"];

export function TransactionTable({
  data,
  total,
  page,
  limit,
  limitOptions,
  isLoading,
  isError,
  onPageChangeAction,
  onLimitChangeAction,
  onRowClickAction,
}: TransactionTableProps) {
  const totalPages = Math.ceil(total / limit);
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  function getPageNumbers(): (number | "ellipsis")[] {
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "ellipsis")[] = [1];
    if (page > 3) pages.push("ellipsis");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
    return pages;
  }

  if (isError) {
    return (
      <div className="flex h-40 items-center justify-center rounded-md border text-sm text-destructive">
        Gagal memuat data. Silakan coba lagi.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {COLUMNS.map((col) => (
                <TableHead key={col}>{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: limit }).map((_, i) => (
                <TableRow key={i}>
                  {COLUMNS.map((col) => (
                    <TableCell key={col}>
                      <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={COLUMNS.length}
                  className="h-40 text-center text-sm text-muted-foreground"
                >
                  Tidak ada transaksi ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onRowClickAction(row)}
                >
                  <TableCell className="font-mono text-xs">{row.id}</TableCell>
                  <TableCell>{row.sender_name}</TableCell>
                  <TableCell>{row.bank}</TableCell>
                  <TableCell>{formatRupiah(row.amount)}</TableCell>
                  <TableCell>{formatRupiah(row.admin_fee)}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[row.status]}>{row.status}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(row.created_at)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRowClickAction(row);
                      }}
                    >
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>
            {total === 0
              ? "Tidak ada transaksi"
              : `Menampilkan ${from}–${to} dari ${total} transaksi`}
          </span>
          <div className="flex items-center gap-1.5">
            <span>Tampilkan</span>
            <select
              value={limit}
              onChange={(e) => onLimitChangeAction(Number(e.target.value))}
              className="h-7 rounded-md border border-input bg-transparent px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {limitOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <span>baris</span>
          </div>
        </div>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) onPageChangeAction(page - 1);
                  }}
                  aria-disabled={page <= 1 || isLoading}
                  className={page <= 1 || isLoading ? "pointer-events-none opacity-50" : ""}
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
                  className={page >= totalPages || isLoading ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
