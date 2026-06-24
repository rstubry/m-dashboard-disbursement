import { useRouter } from "next/navigation";

type NavbarProps = {
  role: string | null;
};

export function Navbar({ role }: NavbarProps) {
  const router = useRouter();

  function handleLogout() {
    document.cookie = "token=; path=/; max-age=0";
    router.push("/login");
  }

  return (
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
  );
}
