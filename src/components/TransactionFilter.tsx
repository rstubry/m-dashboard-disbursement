"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { TransactionStatus } from "@/models/transaction";

const STATUS_OPTIONS: { label: string; value: TransactionStatus | "" }[] = [
  { label: "Semua Status", value: "" },
  { label: "PENDING", value: "PENDING" },
  { label: "SUCCESS", value: "SUCCESS" },
  { label: "FAILED", value: "FAILED" },
];

const filterSchema = z.object({
  search: z.string(),
  status: z.enum(["", "PENDING", "SUCCESS", "FAILED"]),
});

type FilterValues = z.infer<typeof filterSchema>;

export type FilterableStatus = "" | "PENDING" | "SUCCESS" | "FAILED";

type TransactionFilterProps = {
  search: string;
  status: FilterableStatus;
  onFilterChangeAction: (search: string, status: FilterableStatus) => void;
};

export function TransactionFilter({
  search,
  status,
  onFilterChangeAction,
}: TransactionFilterProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: { search, status },
  });

  function onSubmit(values: FilterValues) {
    onFilterChangeAction(values.search, values.status);
    setOpen(false);
  }

  function handleReset() {
    form.reset({ search: "", status: "" });
    onFilterChangeAction("", "");
    setOpen(false);
  }

  const hasFilter = search !== "" || status !== "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filter
          {hasFilter && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              !
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Filter Transaksi</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="search"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="filter-search">Nama Pengirim</FieldLabel>
                  <Input
                    {...field}
                    id="filter-search"
                    placeholder="Cari nama pengirim..."
                  />
                </Field>
              )}
            />
            <Controller
              name="status"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="filter-status">Status</FieldLabel>
                  <select
                    {...field}
                    id="filter-status"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter className="mt-4 gap-2">
            <Button type="button" variant="ghost" onClick={handleReset}>
              Reset
            </Button>
            <Button type="submit">Terapkan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
