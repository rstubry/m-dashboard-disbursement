"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TransactionFilter } from "@/components/pages/transaction/table/TransactionFilter";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Search, Menu } from "lucide-react";
import type { FilterableStatus } from "@/components/pages/transaction/table/TransactionFilter.schema";
import { cn } from "@/lib/utils";

type NavbarProps = {
  role: string | null;
  search: string;
  status: FilterableStatus;
  onSearchChangeAction: (value: string) => void;
  onStatusChangeAction: (status: FilterableStatus) => void;
};

function SearchInput({
  search,
  onSearchChangeAction,
}: {
  search: string;
  onSearchChangeAction: (value: string) => void;
}) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search sender name..."
        defaultValue={search}
        onChange={(e) => onSearchChangeAction(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}

function UserMenu({ role }: { role: string | null }) {
  const router = useRouter();

  function handleLogout() {
    document.cookie = "token=; path=/; max-age=0";
    router.push("/login");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer">
          <Avatar>
            <AvatarFallback>
              {role?.charAt(0).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled>
          <span className="text-sm capitalize">{role}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
          onClick={handleLogout}
        >
          <LogOut size={16} className="mr-1" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Navbar({
  role,
  search,
  status,
  onSearchChangeAction,
  onStatusChangeAction,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(true);

  return (
    <Collapsible open={mobileOpen} onOpenChange={setMobileOpen}>
      <header className={cn("border-b px-4 pt-3 pb-3 md:px-6 md:py-4")}>
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CollapsibleTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon-sm" className="cursor-pointer">
                  <Menu className="size-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </CollapsibleTrigger>
              <h1 className="text-base font-semibold md:text-lg">
                Dashboard Disbursement
              </h1>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <div className="relative w-[260px]">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search sender name..."
                  defaultValue={search}
                  onChange={(e) => onSearchChangeAction(e.target.value)}
                  className="pl-8"
                />
              </div>
              <TransactionFilter
                status={status}
                onFilterChangeAction={onStatusChangeAction}
              />
              <Separator orientation="vertical" className="mx-1 self-stretch" />
              <UserMenu role={role} />
            </div>

            <div className="md:hidden">
              <UserMenu role={role} />
            </div>
          </div>
        </div>

        <CollapsibleContent className="overflow-hidden md:hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <div className="mx-auto max-w-7xl pt-3 flex flex-col gap-3">
            <SearchInput
              search={search}
              onSearchChangeAction={onSearchChangeAction}
            />
            <TransactionFilter
              status={status}
              onFilterChangeAction={onStatusChangeAction}
            />
          </div>
        </CollapsibleContent>
      </header>
    </Collapsible>
  );
}
