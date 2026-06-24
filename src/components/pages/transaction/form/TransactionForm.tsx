"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateTransaction } from "@/hooks/useTransactions";
import { BANKS } from "@/lib/constants";
import type { Transaction } from "@/models/transaction";
import {
  type TransactionFormValues,
  formSchema,
  calcAdminFee,
} from "./TransactionForm.schema";

type TransactionFormProps = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  type: "ADD" | "VIEW";
  transaction?: Transaction;
};

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
          toast.success("Transaction created successfully");
          onOpenChangeAction(false);
        },
        onError: (err) => {
          toast.error(
            err instanceof Error ? err.message : "Failed to create transaction",
          );
        },
      },
    );
  }

  const isPending = createMutation.isPending;
  const isView = type === "VIEW";

  return (
    <Sheet open={open} onOpenChange={onOpenChangeAction}>
      <SheetContent
        side="right"
        className="w-full! overflow-y-auto sm:max-w-sm"
      >
        <SheetHeader className="pb-0!">
          <SheetTitle>
            {isView ? "Transaction Details" : "Create Transaction"}
          </SheetTitle>
        </SheetHeader>

        <Separator />

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
                    <FieldLabel htmlFor="sender_name">Sender Name</FieldLabel>
                    <Input
                      {...field}
                      id="sender_name"
                      placeholder="e.g. Budi Santoso"
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
                      Account Number
                    </FieldLabel>
                    <Input
                      {...field}
                      id="account_number"
                      placeholder="e.g. 1234567890"
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
                    <FieldLabel htmlFor="bank">Destination Bank</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending || isView}
                    >
                      <SelectTrigger id="bank">
                        <SelectValue placeholder="Select bank" />
                      </SelectTrigger>
                      <SelectContent>
                        {BANKS.map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <FieldLabel htmlFor="amount">Transfer Amount</FieldLabel>
                    <Input
                      {...field}
                      id="amount"
                      type="number"
                      placeholder="e.g. 1250000"
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
                    <FieldLabel htmlFor="note">Note (optional)</FieldLabel>
                    <Input
                      {...field}
                      id="note"
                      placeholder="e.g. Supplier payment"
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
                  variant="outline"
                  className="flex-1 cursor-pointer"
                  onClick={() => onOpenChangeAction(false)}
                >
                  Close
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 p-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 cursor-pointer"
                  onClick={() => onOpenChangeAction(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 cursor-pointer" disabled={isPending}>
                  {isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
