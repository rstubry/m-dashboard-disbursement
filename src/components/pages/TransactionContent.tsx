"use client";

import { useState } from "react";
import { useGetTransactions } from "@/hooks/useTransactions";
import { useFilters } from "@/hooks/useFilters";
import { useAuth } from "@/hooks/useAuth";
import { TransactionTable } from "@/components/pages/transaction/table/TransactionTable";
import { TransactionForm } from "@/components/pages/transaction/form/TransactionForm";
import { Navbar } from "@/components/molecules/Navbar";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { exportToCSV } from "@/lib/utils";
import type { FilterableStatus } from "@/components/pages/transaction/table/TransactionFilter.schema";
import type { Transaction } from "@/models/transaction";
import { LIMIT_OPTIONS, DEFAULT_LIMIT } from "@/lib/constants";

export function TransactionContent() {
  const { updateFilters, getParam } = useFilters();
  const { role } = useAuth();

  const page = Number(getParam("page", "1"));
  const limit = Number(getParam("limit", String(DEFAULT_LIMIT)));
  const search = getParam("search");
  const status = getParam("status") as FilterableStatus;
  const sortBy = getParam("sortBy");
  const order = getParam("order", "asc");

  const [formOpen, setFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const { data, isLoading, isError } = useGetTransactions({
    page,
    limit,
    ...(search && { search }),
    ...(status && { status }),
    ...(sortBy && { sortBy: sortBy as keyof Transaction }),
    ...(order && { order: order as "asc" | "desc" }),
  });

  function handleStatusChange(newStatus: FilterableStatus) {
    updateFilters({ search, status: newStatus, page: "1" });
  }

  function handleSearchChange(value: string) {
    updateFilters({ search: value, status, page: "1" });
  }

  function handlePageChange(newPage: number) {
    updateFilters({ page: String(newPage) });
  }

  function handleLimitChange(newLimit: number) {
    updateFilters({ limit: String(newLimit), page: "1" });
  }

  function handleSortChange(newSortBy: string, newOrder: string) {
    updateFilters({ sortBy: newSortBy, order: newOrder, page: "1" });
  }

  const CSV_COLUMNS = [
    { key: "id" as const, label: "ID" },
    { key: "sender_name" as const, label: "Sender Name" },
    { key: "account_number" as const, label: "Account Number" },
    { key: "bank" as const, label: "Bank" },
    { key: "amount" as const, label: "Amount" },
    { key: "admin_fee" as const, label: "Admin Fee" },
    { key: "status" as const, label: "Status" },
    { key: "note" as const, label: "Note" },
    { key: "created_at" as const, label: "Date" },
  ];

  function handleExportCSV() {
    const items = data?.data;
    if (!items || items.length === 0) return;
    const now = new Date();
    const ts = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
      "-",
      String(now.getHours()).padStart(2, "0"),
      String(now.getMinutes()).padStart(2, "0"),
      String(now.getSeconds()).padStart(2, "0"),
    ].join("");
    exportToCSV(items, CSV_COLUMNS, `${ts}-transactions.csv`);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        role={role}
        search={search}
        status={status}
        onSearchChangeAction={handleSearchChange}
        onStatusChangeAction={handleStatusChange}
      />

      <main className="flex-1 px-4 py-6 md:px-6">
        <div className="mx-auto w-full max-w-7xl">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-medium">Transaction List</h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {data?.data && data.data.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="cursor-pointer w-full sm:w-auto"
              >
                <Download className="size-4" />
                Export CSV
              </Button>
            )}
            {role === "operator" && (
              <Button
                size="sm"
                onClick={() => setFormOpen(true)}
                className="cursor-pointer w-full sm:w-auto"
              >
                <Plus className="size-4" />
                Create Transaction
              </Button>
            )}
          </div>
        </div>

        <TransactionTable
          data={data?.data ?? []}
          total={data?.total ?? 0}
          page={page}
          limit={limit}
          limitOptions={LIMIT_OPTIONS}
          isLoading={isLoading}
          isError={isError}
          isAdmin={role === "admin"}
          search={search}
          status={status}
          sortBy={sortBy}
          order={order}
          onPageChangeAction={handlePageChange}
          onLimitChangeAction={handleLimitChange}
          onRowClickAction={setSelectedTransaction}
          onSortChangeAction={handleSortChange}
        />
        </div>
      </main>

      {role === "operator" && (
        <TransactionForm
          open={formOpen}
          onOpenChangeAction={setFormOpen}
          type="ADD"
        />
      )}

      <TransactionForm
        open={selectedTransaction !== null}
        onOpenChangeAction={() => setSelectedTransaction(null)}
        type="VIEW"
        transaction={selectedTransaction ?? undefined}
      />
    </div>
  );
}
