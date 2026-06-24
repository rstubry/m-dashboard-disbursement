"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  confirmVariant?: "default" | "destructive";
  isPending?: boolean;
  onConfirmAction: () => void;
  onCancelAction: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  confirmVariant = "default",
  isPending = false,
  onConfirmAction,
  onCancelAction,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onCancelAction(); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{description}</p>
        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onCancelAction} disabled={isPending}>
            Batal
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirmAction}
            disabled={isPending}
          >
            {isPending ? "Memproses..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
