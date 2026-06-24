import { Suspense } from "react";
import { TransactionContent } from "@/components/pages/TransactionContent";

export default function DashboardPage() {
  return (
    <Suspense>
      <TransactionContent />
    </Suspense>
  );
}
