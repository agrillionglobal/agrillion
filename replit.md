# Agrillion

Nigerian agro-fintech web application built on a regulation-safe **Rewards + Smart Units** utility model. Members pay everyday bills (airtime, data, cable, electricity, internet), earn Smart Units from the platform margin, and redeem them on a Nigerian-grown agro-marketplace. A Tech module publishes real-time progress on Agrillion-backed projects (rice mills, cassava plants, cold storage, etc.).

> Smart Units are non-monetary platform rewards. Banned vocabulary (shares, investment, dividend, ROI, profit, returns, securities) is not used anywhere in the product copy.

## Architecture

- **Monorepo** managed by pnpm with two registered artifacts: a React + Vite web app (`@workspace/agrillion`) and an Express API server (`@workspace/api-server`).
- **OpenAPI spec** at `lib/api-spec/openapi.yaml` is the source of truth for endpoints, schemas, and a generated React Query client (`@workspace/api-client-react`).
- **Drizzle ORM** schema at `lib/db/src/schema/agrillion.ts` (members, wallets, smart_units_ledger, utility_transactions, mart_products/orders, projects, settings, notifications).
- **Demo seed** at `artifacts/api-server/src/lib/agrillion.ts` runs at server startup and creates 3 members, ~20 utility transactions, 10 mart products, 5 projects, notifications, and admin settings.

### Routing

Public:
- `/` – landing page with hero, How It Works, module previews, projects, testimonials, CTA
- `/login` – sign-in (demo only)
- `/register` – create member account with state/LGA selectors
- `/shares` – legacy redirect → `/smart`

Authenticated app shell:
- `/dashboard` – wallet cards, weekly Smart Units chart, spend by category, quick actions, recent activity
- `/smart` – pay bills (airtime/data/cable/electricity/internet), Smart Units summary, ledger, transfer to other members
- `/mart` – product grid (cash / units / split payment), order history
- `/tech` – projects with milestones, updates, impact metrics
- `/admin` – KPIs, member growth, revenue charts, members table, transactions table, settings (unit value, member reward split, service toggles)

## Frontend stack

- React 18 + Vite 7
- wouter for routing
- @tanstack/react-query (queries pre-fetched and invalidated after mutations)
- shadcn/ui components on Tailwind v4
- recharts for analytics
- framer-motion for entrance animations
- sonner for toasts

### Theme

Custom palette: deep forest green (`hsl(150 35% 12%)`), brushed gold (`hsl(42 75% 55%)`), and ivory (`hsl(42 38% 97%)`) with full dark-mode support. Inter for body text, Fraunces for serif headings. Utility classes `.gold-gradient`, `.gold-text`, `.forest-gradient`, `.ivory-grain`, and `.leaf-motif` provide the brand aesthetic.

### API client wiring

`artifacts/agrillion/src/lib/api.ts` calls `setBaseUrl("")` so the auto-generated paths (which already contain `/api/...`) resolve correctly through the artifact proxy.

## Backend stack

- Express + pino-http
- Drizzle ORM on PostgreSQL (via `DATABASE_URL`)
- Zod schemas generated from OpenAPI for request/response validation
- Routes mounted at `/api/*` (members, wallet, smartUnits, utilities, mart, tech, dashboard, admin, health)

### Demo authentication

`getCurrentMember()` returns the first seeded member (Adaeze, AGP-LA-IKE-000245). Wallet PIN is `0000`. Replace these with a real auth flow when productionising.

## Conventions

- All currency values formatted with `naira()` from `src/lib/format.ts`
- Smart Units rendered with `units()` and `gold-text` utility
- Nigerian states and LGAs in `NIGERIA_STATES_LGAS`
- Membership IDs follow `AGP-{STATE_CODE}-{LGA_CODE}-{NNNNNN}`
- Mobile-first design — no emojis anywhere in product copy
