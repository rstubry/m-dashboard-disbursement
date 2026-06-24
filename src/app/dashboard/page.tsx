"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetTransactions } from "@/hooks/useTransactions";
import { useFilters } from "@/hooks/useFilters";
import { useAuth } from "@/hooks/useAuth";
import { TransactionTable } from "@/components/TransactionTable";
import { TransactionFilter } from "@/components/TransactionFilter";
import { TransactionForm } from "@/components/TransactionForm";
import { Button } from "@/components/ui/button";
import type { FilterableStatus } from "@/components/TransactionFilter";
import type { Transaction } from "@/models/transaction";
import { LIMIT_OPTIONS, DEFAULT_LIMIT } from "@/lib/constants";

function DashboardContent() {
  const router = useRouter();
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

  function handleLogout() {
    document.cookie = "token=; path=/; max-age=0";
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-lg font-semibold">Dashboard Disbursement</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground capitalize">
              {role}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-destructive hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

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
          onPageChangeAction={handlePageChange}
          onLimitChangeAction={handleLimitChange}
        />
      </main>

      {role === "operator" && (
        <TransactionForm
          open={formOpen}
          onOpenChangeAction={setFormOpen}
          type="ADD"
        />
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
