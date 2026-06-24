# Mini Dashboard Disbursement

Fintech disbursement dashboard for two roles: **operator** (create transactions) and **admin** (approve/reject).

- **Production**: [mdbdsb.rstubryan.site](https://mdbdsb.rstubryan.site)
- **Backup**: [m-dashboard-disbursement.vercel.app](https://m-dashboard-disbursement.vercel.app)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Login Credentials

| Username | Password    | Role     |
| -------- | ----------- | -------- |
| admin    | admin123    | admin    |
| operator | operator123 | operator |

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State/Server**: TanStack Query v5, React Hook Form + Zod
- **HTTP**: Axios (with 401 interceptor)
- **Auth**: Fake JWT (encode/decode via custom lib)
- **UI Primitives**: Radix UI (Dialog, Select, Sheet, Collapsible, Dropdown Menu, Avatar)

## Implemented Features

### Core

- ✅ Login form with Zod validation + JWT auth
- ✅ Protected routes via `proxy.ts` + 401 Axios interceptor
- ✅ Transaction list with server-side pagination, search (debounce 400ms), status filter
- ✅ Create transaction form (operator only) — 5 fields + admin fee auto-calc
- ✅ Update status via approve/reject (admin only) with confirmation dialog
- ✅ Transaction detail modal (click row → Sheet with all fields)
- ✅ URL state persistence — filters survive refresh
- ✅ Role-based UI — buttons hidden (not disabled) per role
- ✅ Loading (skeleton), empty, and error states all handled

### Bonus

- ✅ Mobile responsive (collapsible navbar, centered pagination, full-width sheets)
- ✅ Skeleton loading during data fetch
- ✅ Server-side sort — clickable table headers with sort direction indicators
- ✅ CSV export — download filtered data with timestamped filename
- ✅ URL filter persistence

## API

Configure `NEXT_PUBLIC_API_BASE_URL` in `.env`. See `.env.example`.

| Method | Endpoint          | Description              |
| ------ | ----------------- | ------------------------ |
| GET    | /transactions     | List + filter + paginate |
| POST   | /transactions     | Create transaction       |
| PUT    | /transactions/:id | Update status            |

## Project Structure

```
src/
├── api/                  # Axios instance + API functions
├── app/                  # Next.js App Router pages
│   ├── dashboard/        # Protected dashboard
│   └── login/            # Login page
├── components/
│   ├── molecules/        # Navbar, ConfirmDialog
│   ├── pages/            # Page components
│   │   ├── login/        # LoginForm
│   │   └── transaction/  # TransactionTable, TransactionFilter, TransactionForm
│   └── ui/               # UI primitives (Badge, Button, Sheet, Dialog, etc.)
├── hooks/                # useAuth, useFilters, useTransactions
├── lib/                  # utils, jwt, constants
├── models/               # TypeScript types
└── proxy.ts              # Route protection
```

## Scripts

| Command             | Description      |
| ------------------- | ---------------- |
| `npm run dev`       | Start dev server |
| `npm run build`     | Production build |
| `npm run lint`      | ESLint           |
| `npm run typecheck` | TypeScript check |

## Docker

```bash
# Build and start
make build

# Start
make up

# View logs
make logs

# Stop
make down
```

Or directly with Docker Compose:

```bash
docker compose up -d --build
```

Configure the API base URL via `NEXT_PUBLIC_API_BASE_URL` in `.env`.

## Notes

- Authentication is simulated with fake JWT stored in cookie — not for production use.
- 401 interceptor is implemented even though the mock API never returns 401.
- Admin fee: Rp 2,500 if amount &lt; 5M, Rp 5,000 if amount ≥ 5M.
- Status auto-set to `PENDING` on create.
- All UI strings are in English.
