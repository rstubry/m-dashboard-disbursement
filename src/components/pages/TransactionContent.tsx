"use client";

import { useState } from "react";
import { useGetTransactions } from "@/hooks/useTransactions";
import { useFilters } from "@/hooks/useFilters";
import { useAuth } from "@/hooks/useAuth";
import { TransactionTable } from "@/components/pages/transaction/table/TransactionTable";
import { TransactionFilter } from "@/components/pages/transaction/table/TransactionFilter";
import { TransactionForm } from "@/components/pages/transaction/form/TransactionForm";
import { Navbar } from "@/components/molecules/Navbar";
import { Button } from "@/components/ui/button";
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

  const [formOpen, setFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const { data, isLoading, isError } = useGetTransactions({
    page,
    limit,
    ...(search && { search }),
    ...(status && { status }),
  });

  function handleFilterApply(newSearch: string, newStatus: FilterableStatus) {
    updateFilters({ search: newSearch, status: newStatus, page: "1" });
  }

  function handlePageChange(newPage: number) {
    updateFilters({ page: String(newPage) });
  }

  function handleLimitChange(newLimit: number) {
    updateFilters({ limit: String(newLimit), page: "1" });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar role={role} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-6 sm:px-0">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-medium">Daftar Transaksi</h2>
          <div className="flex items-center gap-2">
            {role === "operator" && (
              <Button size="sm" onClick={() => setFormOpen(true)}>
                + Buat Transaksi
              </Button>
            )}
            <TransactionFilter
              search={search}
              status={status}
              onFilterChangeAction={handleFilterApply}
            />
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
          onPageChangeAction={handlePageChange}
          onLimitChangeAction={handleLimitChange}
          onRowClickAction={setSelectedTransaction}
        />
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
