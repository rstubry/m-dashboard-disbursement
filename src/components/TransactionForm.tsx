"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateTransaction } from "@/hooks/useTransactions";
import { BANKS } from "@/lib/constants";
import type { Bank, Transaction } from "@/models/transaction";

type TransactionFormValues = {
  sender_name: string;
  account_number: string;
  bank: Bank;
  amount: number;
  note: string;
};

const formSchema = z.object({
  sender_name: z
    .string()
    .min(3, "Minimal 3 karakter")
    .max(100, "Maksimal 100 karakter"),
  account_number: z
    .string()
    .regex(/^\d{6,20}$/, "Nomor rekening harus 6–20 digit angka"),
  bank: z.enum(
    [
      "BCA",
      "BRI",
      "BNI",
      "Mandiri",
      "BSI",
      "CIMB Niaga",
      "Permata",
      "Danamon",
      "BTN",
    ],
    { message: "Pilih bank tujuan" },
  ),
  amount: z
    .number({ message: "Harus berupa angka" })
    .int("Harus angka bulat")
    .min(10000, "Minimal Rp 10.000"),
  note: z.string().max(255, "Maksimal 255 karakter"),
});

type TransactionFormProps = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  type: "ADD" | "VIEW";
  transaction?: Transaction;
};

function calcAdminFee(amount: number): number {
  return amount >= 5_000_000 ? 5000 : 2500;
}

export function TransactionForm({
  open,
  onOpenChangeAction,
  type,
  transaction,
}: TransactionFormProps) {
  const createMutation = useCreateTransaction();

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sender_name: "",
      account_number: "",
      bank: "BCA",
      amount: 0,
      note: "",
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
      return;
    }
    if (type === "VIEW" && transaction) {
      form.reset({
        sender_name: transaction.sender_name,
        account_number: transaction.account_number,
        bank: transaction.bank,
        amount: transaction.amount,
        note: transaction.note,
      });
    }
  }, [open, type, transaction, form]);

  function onSubmit(values: TransactionFormValues) {
    createMutation.mutate(
      {
        sender_name: values.sender_name,
        account_number: values.account_number,
        bank: values.bank,
        amount: values.amount,
        admin_fee: calcAdminFee(values.amount),
        status: "PENDING",
        note: values.note,
      },
      {
        onSuccess: () => {
          toast.success("Transaksi berhasil dibuat");
          onOpenChangeAction(false);
        },
        onError: (err) => {
          toast.error(
            err instanceof Error ? err.message : "Gagal membuat transaksi",
          );
        },
      },
    );
  }

  const isPending = createMutation.isPending;
  const isView = type === "VIEW";

  return (
    <Sheet open={open} onOpenChange={onOpenChangeAction}>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isView ? "Detail Transaksi" : "Buat Transaksi"}
          </SheetTitle>
        </SheetHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto px-4 py-2">
            <FieldGroup>
              <Controller
                name="sender_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="sender_name">Nama Pengirim</FieldLabel>
                    <Input
                      {...field}
                      id="sender_name"
                      placeholder="Contoh: Budi Santoso"
                      disabled={isPending || isView}
                      readOnly={isView}
                    />
                    {fieldState.error && (
                      <p className="text-xs text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="account_number"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="account_number">
                      Nomor Rekening
                    </FieldLabel>
                    <Input
                      {...field}
                      id="account_number"
                      placeholder="Contoh: 1234567890"
                      disabled={isPending || isView}
                      readOnly={isView}
                    />
                    {fieldState.error && (
                      <p className="text-xs text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="bank"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="bank">Bank Tujuan</FieldLabel>
                    <select
                      {...field}
                      id="bank"
                      disabled={isPending || isView}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
                    >
                      {BANKS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    {fieldState.error && (
                      <p className="text-xs text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="amount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="amount">Jumlah Transfer</FieldLabel>
                    <Input
                      {...field}
                      id="amount"
                      type="number"
                      placeholder="Contoh: 1250000"
                      disabled={isPending || isView}
                      readOnly={isView}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                    {fieldState.error && (
                      <p className="text-xs text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="note"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="note">Catatan (opsional)</FieldLabel>
                    <Input
                      {...field}
                      id="note"
                      placeholder="Contoh: Pembayaran supplier"
                      disabled={isPending || isView}
                      readOnly={isView}
                    />
                    {fieldState.error && (
                      <p className="text-xs text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          <div className="sticky bottom-0 bg-popover">
            <Separator />
            {isView ? (
              <div className="flex gap-2 p-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1"
                  onClick={() => onOpenChangeAction(false)}
                >
                  Tutup
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 p-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1"
                  onClick={() => onOpenChangeAction(false)}
                  disabled={isPending}
                >
                  Batal
                </Button>
                <Button type="submit" className="flex-1" disabled={isPending}>
                  {isPending ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            )}
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
